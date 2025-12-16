import * as THREE from 'three'
import {COLOR_BASE, GeometryPack} from "@constants/constants.ts";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import Stats from 'three/examples/jsm/libs/stats.module.js'
import {ResizeController} from "three/controllers/resizeController/resizeController.ts";
import {ModelController} from "three/controllers/modelController.ts";


export class Controller {
  private el: HTMLCanvasElement;
  private size: { w: number, h: number } = {w: 0, h: 0};
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private orbitControls: OrbitControls;
  private resizeController!: ResizeController;


  private clock: THREE.Clock;
  private stats;

  private charController!: ModelController;
  model: THREE.Object3D | null = null;


  constructor(el: HTMLCanvasElement, size) {
    this.el = el;
    this.size.w = size.w;
    this.size.h = size.h;
    this.scene = new THREE.Scene();

    this.tick = this.tick.bind(this);

    this.init();
  }


  async init() {
    this.createAxesHelper();
    await this.createModels();
    // this.createObjects();
    this.createCamera();
    this.createRender();
    this.createStats();

    this.setControls();

    this.clock = new THREE.Clock();
    this.tick();

    this.resizeController = new ResizeController({
      size: this.size,
      scene: this.scene,
      camera: this.camera,
      renderer: this.renderer});
    this.resizeController.addResizeListener();
  }


  createAxesHelper() {
    const axesHelper = new THREE.AxesHelper(3);
    this.scene.add(axesHelper);
  }

  async createModels() {
    this.charController = await ModelController.create('/models/luoli/scene.gltf', true);
    this.model = this.charController.scene
    this.model?.scale.set(.02,.02,.02)
    if(this.model) {
      this.scene.add(this.model)
    }
  }

  createObjects() {
    const mesh = new THREE.Mesh(GeometryPack[1], new THREE.MeshBasicMaterial({color: COLOR_BASE, wireframe: true}));
    mesh.position.set(0, 0, 0);
    this.scene.add(mesh);
  }


  createCamera() {
    this.camera = new THREE.PerspectiveCamera(75, this.size.w / this.size.h);
    this.scene.add(this.camera);
    this.camera.position.set(0, 0, 7);
  }


  createRender() {
    this.renderer = new THREE.WebGLRenderer({canvas: this.el});
    this.renderer.setSize(this.size.w, this.size.h);
    this.renderer.render(this.scene, this.camera);
  }

  createStats() {
    this.stats = new Stats();
    this.stats.showPanel(0);
    document.body.appendChild(this.stats.dom)
  }


  setControls() {
    //orbitControls
    this.orbitControls = new OrbitControls(this.camera, this.el);
    this.orbitControls.enableDamping = true;
  }


  tick() {
    this.stats.begin();

    this.orbitControls.update();
    this.renderer.render(this.scene, this.camera);

    this.stats.end();
    window.requestAnimationFrame(this.tick);
  }

  destroy() {
    console.log('___DESTROY___')
    this.resizeController.removeResizeListener();
    this.renderer.dispose();
  }

}

