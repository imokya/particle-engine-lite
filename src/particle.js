/*
 *  author: xingway
 */

import * as THREE from 'three'

export default class Particle {

  constructor(params) {
    this.def = {
      position: new THREE.Vector3(),
      velocity: new THREE.Vector3(),
      color: new THREE.Color(0xFFFFFF),
      size: 1,
      alpha: 0,
      rotation: Math.random() * Math.PI * 2,
      life: 1,
      maxLife: 1,
      active: false
    }
    Object.assign(this, this.def, params)
  }

}