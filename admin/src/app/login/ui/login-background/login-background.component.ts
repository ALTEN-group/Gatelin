import { Component, NgZone, OnDestroy, OnInit } from "@angular/core";
import { Player } from "@lcluber/frameratjs";
import {
  FullscreenQuad,
  Material,
  Mesh,
  PerspectiveCamera,
  Renderer,
  Scene,
} from "@lcluber/roostrjs";
import { Vector3 } from "@lcluber/type6js";
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
  cameraPosition!: Vector3;
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
      this.animation.capFPS(14);
      this.shaderService.load().then((response: boolean) => {
        if (response) {
          this.start();https://github.com/DWTechs/Antity.js/settings
        }
      });
    });
  }

  ngOnDestroy() {
    this.animation?.stop();
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
