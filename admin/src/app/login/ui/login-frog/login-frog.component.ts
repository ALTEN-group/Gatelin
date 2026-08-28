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
import { LOGIN_SHADER_FPS_CAP } from "app/login/utils/login-shader-fps";
import { ShaderService } from "app/login/utils/shader.service";

/**
 * Square drawing buffer. Renderer otherwise leaves the canvas on its 1280x720
 * default, and the frog is drawn around a centered square, so a 16:9 buffer
 * scaled into the CSS box would squash the face.
 */
const BUFFER_SIZE = 256;

/**
 * Small WebGL canvas sitting on top of the login card, showing the shadergun
 * frog face. Rendered with roostrjs like the animated login background.
 */
@Component({
  selector: "adm-login-frog",
  templateUrl: "./login-frog.component.html",
  styleUrls: ["./login-frog.component.scss"],
})
export class LoginFrogComponent implements OnInit, OnDestroy {
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
      this.renderer = new Renderer("frogCanvas");
      this.renderer.canvas.width = BUFFER_SIZE;
      this.renderer.canvas.height = BUFFER_SIZE;
      this.renderer.setViewport(BUFFER_SIZE, BUFFER_SIZE);

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
      this.shaderService.loadFrog().then((response: boolean) => {
        if (response) this.start();
      });
    });
  }

  ngOnDestroy() {
    this.animation?.stop();
  }

  private start() {
    this.quad.addProgram(
      this.shaderService.frogVertexShader,
      this.shaderService.frogFragmentShader,
      null as unknown as Material,
    );
    this.animation.start();
  }

  private render() {
    this.renderer.clearFrame();
    this.scene.render(this.camera, this.animation.getTime());
  }
}
