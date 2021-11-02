

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Pane } from 'tweakpane'

import Thrust from './thrust'


class Env {
  
  static instance

  constructor() {
    if(Env.instance) {
      return Env.instance
    }
    Env.instance = this
    this.init()
  }

  init() {
    this._setTime()
    this._createScene()
    this._createEvent()
    this._createControls()
    //this._createPane()
    this._createThrust()
    this.render()
  }

  _createThrust() {
    this.thrust = new Thrust()
  }

  _createPane() {
    this.pane = new Pane()
    this.pane.containerElem_.style.width = '320px'
  }

  _setTime() {
    this.clock = new THREE.Clock()
    this.time = this.clock.getElapsedTime()
  }


  update() {
    if(this.thrust && this.thrust.update) {
      this.thrust.update()
    }
    if(this.controls) {
      this.controls.update()
    }
  } 

  render() {
    this.time = this.clock.getElapsedTime()
    this.update()
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render.bind(this))
  }

  _onResize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.renderer.setSize(w, h)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  _createControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
  }

  _createEvent() {
    window.addEventListener('resize', this._onResize.bind(this))
  }

  _createScene() {
    this.renderer =  new THREE.WebGLRenderer({
      antialias: true
    })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.outputEncoding = THREE.sRGBEncoding
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000)
    this.camera.rotation.order = 'XYZ'
    this.camera.position.set(0, 0, 20)
    document.querySelector('#app').appendChild(this.renderer.domElement)
  }

}


export default Env