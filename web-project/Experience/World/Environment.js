import * as THREE from "three";
import Experience from "../Experience";

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.setSunlight();

    }

    setSunlight(){
        this.sunlight = new THREE.DirectionalLight("#ffffff", 3);
        this.sunlight.castShadow = true;
        this.sunlight.shadow.camera.far = 20;
        this.sunlight.shadow.mapSize.set(2048,2048);
        this.sunlight.shadow.normalBias = 0.05;
        this.sunlight.position.set(1.5,7,3);
        let sunlightOBJ = new THREE.Object3D();
        sunlightOBJ = this.sunlight;
        this.scene.add(sunlightOBJ);

        const ambientlight = new THREE.AmbientLight("#ffffff",0.5);
        let ambientlightOBJ = new THREE.Object3D();
        ambientlightOBJ = ambientlight;
        this.scene.add(ambientlightOBJ);
    }

    resize() {
    }

    update() {
    }


}