import { Injectable } from "@angular/core";
import { IAssets, IResponse, Loader } from "@lcluber/orbisjs";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class ShaderService {
  private readonly assetsFolder: string = environment.assets;
  list: IAssets = {
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
  loader: Loader = new Loader(
    this.list,
    this.assetsFolder,
    undefined,
    undefined,
  );

  public async load(): Promise<boolean> {
    return this.loader.start().then((response: IResponse) => {
      return response.success;
    });
  }

  public get vertexShader(): string {
    return this.loader.getContent("vertex.glsl") as string;
  }

  public get vertexLightShader(): string {
    return this.loader.getContent("vertex-light.glsl") as string;
  }

  public get fragmentShader(): string {
    return this.loader.getContent("fragment.glsl") as string;
  }

  public get fragmentLightShader(): string {
    return this.loader.getContent("fragment-light.glsl") as string;
  }
}
