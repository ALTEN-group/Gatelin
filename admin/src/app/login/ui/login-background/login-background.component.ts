import { Player } from "@1pizzateam/loopr";
import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import {
  FullscreenQuad,
  Material,
  Mesh,
  PerspectiveCamera,
  Renderer,
  Scene,
} from "@lcluber/roostrjs";
import {
  LOGIN_SHADER_DELTA_CAP,
  LOGIN_SHADER_FPS_CAP,
} from "app/login/utils/login-shader-fps";
import { ShaderService } from "app/login/utils/shader.service";

@Component({
  selector: "adm-login-background",
  templateUrl: "./login-background.component.html",
  styleUrls: ["./login-background.component.scss"],
})
export class LoginBackgroundComponent implements OnInit, OnDestroy {
  renderer!: Renderer;
  scene!: Scene;
  camera!: PerspectiveCamera;
  quad!: Mesh;
  animation!: Player;

  constructor(
    private readonly shaderService: ShaderService,
    private readonly zone: NgZone,
  ) {}

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.renderer = new Renderer("canvas");
      this.scene = new Scene(this.renderer.getContext()!);
      this.camera = new PerspectiveCamera(
        75,
        0.1,
        1000,
        this.renderer.getContext()!,
      );
      this.quad = new Mesh(new FullscreenQuad(), this.renderer.getContext()!);

      this.scene.addMesh(this.quad);
      this.animation = new Player(this.render);
      this.animation.setScope(this);
      this.animation.capFPS(LOGIN_SHADER_FPS_CAP);
      this.animation.capDelta(LOGIN_SHADER_DELTA_CAP);
      this.shaderService.load().then((response: boolean) => {
        if (response) this.start();
      });
    });
  }

  ngOnDestroy() {
    if (this.animation?.isActive()) this.animation.stop();
  }

  private start() {
    this.quad.addProgram(
      this.shaderService.vertexShader,
      this.shaderService.fragmentShader,
      null as unknown as Material,
    );
    this.animation.start();
  }

  private render() {
    this.renderer.clearFrame();
    this.scene.render(this.camera, this.animation.getTime());
  }
}
