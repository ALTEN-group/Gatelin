import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom, forkJoin } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class ShaderService {
  private readonly http = inject(HttpClient);
  private readonly folder = `${environment.assets}/shader/`;
  private vertex = "";
  private vertexLight = "";
  private fragment = "";
  private fragmentLight = "";
  private frogVertex = "";
  private frogFragment = "";

  public async load(): Promise<boolean> {
    return firstValueFrom(
      forkJoin({
        vertex: this.get("vertex.glsl"),
        vertexLight: this.get("vertex-light.glsl"),
        fragment: this.get("fragment.glsl"),
        fragmentLight: this.get("fragment-light.glsl"),
      }),
    )
      .then((response) => {
        this.vertex = response.vertex;
        this.vertexLight = response.vertexLight;
        this.fragment = response.fragment;
        this.fragmentLight = response.fragmentLight;
        return true;
      })
      .catch(() => false);
  }

  /** Loaded on its own so the frog canvas and the background do not block each other. */
  public async loadFrog(): Promise<boolean> {
    return firstValueFrom(
      forkJoin({
        vertex: this.get("frog-face_vert-ready.glsl"),
        fragment: this.get("frog-face_frag-ready.glsl"),
      }),
    )
      .then((response) => {
        this.frogVertex = response.vertex;
        this.frogFragment = response.fragment;
        return true;
      })
      .catch(() => false);
  }

  private get(file: string) {
    return this.http.get(`${this.folder}${file}`, { responseType: "text" });
  }

  public get vertexShader(): string {
    return this.vertex;
  }

  public get vertexLightShader(): string {
    return this.vertexLight;
  }

  public get fragmentShader(): string {
    return this.fragment;
  }

  public get fragmentLightShader(): string {
    return this.fragmentLight;
  }

  public get frogVertexShader(): string {
    return this.frogVertex;
  }

  public get frogFragmentShader(): string {
    return this.frogFragment;
  }
}
