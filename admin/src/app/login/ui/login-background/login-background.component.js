import { __decorate } from "tslib";
import { Component, ChangeDetectionStrategy } from "@angular/core";
import { Player } from "@lcluber/frameratjs";
import { FullscreenQuad, Mesh, PerspectiveCamera, Renderer, Scene, } from "@lcluber/roostrjs";
let LoginBackgroundComponent = class LoginBackgroundComponent {
    constructor(shaderService, zone) {
        this.shaderService = shaderService;
        this.zone = zone;
    }
    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.renderer = new Renderer("canvas");
            this.scene = new Scene(this.renderer.getContext());
            this.camera = new PerspectiveCamera(75, 0.1, 1000, this.renderer.getContext());
            this.quad = new Mesh(new FullscreenQuad(), this.renderer.getContext());
            this.scene.addMesh(this.quad);
            this.animation = new Player(this.render);
            this.animation.setScope(this);
            this.animation.capFPS(14);
            this.shaderService.load().then((response) => {
                if (response)
                    this.start();
            });
        });
    }
    ngOnDestroy() {
        this.animation?.stop();
    }
    start() {
        this.quad.addProgram(this.shaderService.vertexShader, this.shaderService.fragmentShader, null);
        this.animation.start();
    }
    render() {
        this.renderer.clearFrame();
        this.scene.render(this.camera, this.animation.getTime());
    }
};
LoginBackgroundComponent = __decorate([
    Component({
        selector: "adm-login-background",
        templateUrl: "./login-background.component.html",
        changeDetection: ChangeDetectionStrategy.Eager,
        styleUrls: ["./login-background.component.scss"],
    })
], LoginBackgroundComponent);
export { LoginBackgroundComponent };
//# sourceMappingURL=login-background.component.js.map