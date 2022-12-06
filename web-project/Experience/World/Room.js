import * as THREE from "three";
import Experience from "../Experience";

export default class Room {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;

        // const geometry = new THREE.BoxGeometry( 1, 1, 1 );
		// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
		// const cube = new THREE.Mesh( geometry, material );
		// this.scene.add( cube );
        this.resources = this.experience.resources;
        this.room = this.resources.items.room;
        this.actualRoom = this.room.scene;
        console.log(this.actualRoom);

        this.setModel();

    }

    setModel(){
        this.actualRoom.children.forEach(child=> {

            child.castShadow = true;
            child.receiveShadow = true;
            // console.log(child);
            if(child instanceof THREE.Group){
                child.children.forEach((groupchild)=>{
                    groupchild.castShadow = true;
                    groupchild.receiveShadow = true;
                })
            }
            
        });
        this.scene.add(this.actualRoom);
    }

    resize() {
    }

    update() {
    }


}