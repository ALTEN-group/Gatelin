import { __decorate } from "tslib";
import { Injectable } from "@angular/core";
import { Loader } from "@lcluber/orbisjs";
import { environment } from "environments/environment";
let ShaderService = class ShaderService {
    constructor() {
        this.assetsFolder = environment.assets;
        this.list = {
            shaders: {
                folder: "shader",
                files: [
                    { name: "vertex.glsl" },
                    { name: "fragment.glsl" },
                    { name: "vertex-light.glsl" },
                    { name: "fragment-light.glsl" },
                ],
            },
        };
        this.loader = new Loader(this.list, this.assetsFolder, undefined, undefined);
    }
    async load() {
        return this.loader.start().then((response) => {
            return response.success;
        });
    }
    get vertexShader() {
        return this.loader.getContent("vertex.glsl");
    }
    get vertexLightShader() {
        return this.loader.getContent("vertex-light.glsl");
    }
    get fragmentShader() {
        return this.loader.getContent("fragment.glsl");
    }
    get fragmentLightShader() {
        return this.loader.getContent("fragment-light.glsl");
    }
};
ShaderService = __decorate([
    Injectable({
        providedIn: "root",
    })
], ShaderService);
export { ShaderService };
//# sourceMappingURL=shader.service.js.map