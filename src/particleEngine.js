/*
 * author: xingway
 */

import * as THREE from 'three'
import Particle from './particle'
import vertexShader from './shaders/particleSystem/vertex.glsl'
import fragmentShader from './shaders/particleSystem/fragment.glsl'
import Tween from './utils/tween'

export default class ParticleEngine {

  constructor(params) {
    this.conf = {
      particlesPerFrame: 3,
      numOfParticles: 30
    }
    Object.assign(this.conf, params)
    this._init()
  }

  _init() {
    this._clock = new THREE.Clock()
    this._activeIndex = 0
    this._initTweens()
    this._initParticles()
    this._initGeometry()
  }

  _updateGeometry(dt) {
    const numOfParticles = this.conf.numOfParticles
    for(let i = 0; i < numOfParticles; i++) {
      const particle = this.particles[i]
      this._position[i * 3 + 0] = particle.position.x
      this._position[i * 3 + 1] = particle.position.y
      this._position[i * 3 + 2] = particle.position.z
      
      this._velocity[i * 3 + 0] = particle.velocity.x
      this._velocity[i * 3 + 1] = particle.velocity.y
      this._velocity[i * 3 + 2] = particle.velocity.z

      this._color[i * 4 + 0] = particle.color.r
      this._color[i * 4 + 1] = particle.color.g
      this._color[i * 4 + 2] = particle.color.b
      this._color[i * 4 + 3] = particle.alpha
      
      this._size[i] = particle.size
      this._rotation[i] = particle.rotation
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(this._position, 3))
    this.geometry.setAttribute('velocity', new THREE.BufferAttribute(this._velocity, 3))
    this.geometry.setAttribute('color', new THREE.BufferAttribute(this._color, 4))
    this.geometry.setAttribute('rotation', new THREE.BufferAttribute(this._rotation, 1))
    this.geometry.setAttribute('size', new THREE.BufferAttribute(this._size, 1))

  }
  
  _recycle(particle) {
    const life = (Math.random() * 0.75 + 0.25) * 2
    particle.position = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    )
    particle.velocity = new THREE.Vector3(0, 5, 0)
    particle.size = (Math.random() * 0.5 + 0.5) * 4
    particle.life = life
    particle.maxLife = life
  }

  _updateParticles(dt) {
    const numOfParticles = this.conf.numOfParticles
    for(let i = 0; i < numOfParticles; i++) {
      const particle = this.particles[i]
      if(particle.active) {
        particle.life -= dt
      }
      if(particle.life <= 0) {
        this._recycle(particle)
      }
    }

    for(let i = 0; i < numOfParticles; i++) {
      const particle = this.particles[i]
      if(particle.active) {
        const t = 1 - particle.life / particle.maxLife
        particle.rotation += dt * 0.5
        particle.size = this._sizeTween.getTween(t)
        particle.color = this._colorTween.getTween(t)
        particle.alpha = this._alphaTween.getTween(t)
        particle.position.add(particle.velocity.clone().multiplyScalar(dt))
        const drag = particle.velocity.clone()
        drag.multiplyScalar(dt * 0.2)
        drag.x = Math.sign(particle.velocity.x) * Math.min(Math.abs(drag.x), Math.abs(particle.velocity.x))
        drag.y = Math.sign(particle.velocity.y) * Math.min(Math.abs(drag.y), Math.abs(particle.velocity.y))
        drag.z = Math.sign(particle.velocity.z) * Math.min(Math.abs(drag.z), Math.abs(particle.velocity.z))
        //particle.velocity.sub(drag)
      }
    }

  }

  _addParticles(dt) {
    const count = this.conf.particlesPerFrame
    for(let i = 0; i < count; i++) {
      if(this.particles[this._activeIndex]) {
        this.particles[this._activeIndex].alpha = 1
        this.particles[this._activeIndex].active = true
        this._activeIndex++
      }
    }
  }

  update() {
    const dt = this._clock.getDelta()
    this._addParticles(dt)
    this._updateParticles(dt)
    this._updateGeometry(dt)
  }

  _initTweens() {

    this._alphaTween = new Tween((t, a, b) => {
      return a + t * (b - a)
    })
    this._alphaTween.addTween(0, 0)
    this._alphaTween.addTween(0.1, 1)
    this._alphaTween.addTween(0.6, 1)
    this._alphaTween.addTween(1, 0)

    this._sizeTween = new Tween((t, a, b) => {
      return a + t * (b - a)
    })
    this._sizeTween.addTween(0, 1)
    this._sizeTween.addTween(0.5, 5)
    this._sizeTween.addTween(1, 1)

    this._colorTween = new Tween((t, a, b) => {
      const c = a.clone()
      return c.lerp(b, t)
    })
    this._colorTween.addTween(0, new THREE.Color(0xFFFF80))
    this._colorTween.addTween(0, new THREE.Color(0xFF8080))

  }

  _initGeometry() {
    const numOfParticles = this.conf.numOfParticles
    const size = new Float32Array(numOfParticles)
    const color = new Float32Array(numOfParticles * 4)
    const position = new Float32Array(numOfParticles * 3)
    const velocity = new Float32Array(numOfParticles * 3)
    const rotation = new Float32Array(numOfParticles)
   

    for(let i = 0; i < numOfParticles; i++) {
      const particle = this.particles[i]
      
      position[i * 3 + 0] = particle.position.x
      position[i * 3 + 1] = particle.position.y
      position[i * 3 + 2] = particle.position.z
      
      velocity[i * 3 + 0] = particle.velocity.x
      velocity[i * 3 + 1] = particle.velocity.y
      velocity[i * 3 + 2] = particle.velocity.z

      color[i * 4 + 0] = particle.color.r
      color[i * 4 + 1] = particle.color.g
      color[i * 4 + 2] = particle.color.b
      color[i * 4 + 3] = particle.alpha
      
      size[i] = particle.size
      rotation[i] = particle.rotation

    }

    this.geometry = new THREE.BufferGeometry()
    this.geometry.setAttribute('position', new THREE.BufferAttribute(position, 3))
    this.geometry.setAttribute('velocity', new THREE.BufferAttribute(velocity, 3))
    this.geometry.setAttribute('color', new THREE.BufferAttribute(color, 4))
    this.geometry.setAttribute('rotation', new THREE.BufferAttribute(rotation, 1))
    this.geometry.setAttribute('size', new THREE.BufferAttribute(size, 1))

    this.geometry.attributes.size.needsUpdate = true
    this.geometry.attributes.color.needsUpdate = true
    this.geometry.attributes.position.needsUpdate = true
    this.geometry.attributes.velocity.needsUpdate = true
    this.geometry.attributes.rotation.needsUpdate = true


    this.material = new THREE.ShaderMaterial({
      uniforms: {
        particleTexture: {
          value: new THREE.TextureLoader().load('textures/fire.jpg')
        }
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false,
      depthTest: true,
      vertexShader,
      fragmentShader
    })
    
    this.mesh = new THREE.Points(this.geometry, this.material)

    this._size = size
    this._color = color
    this._position = position
    this._velocity = velocity
    this._rotation = rotation

  }

  _initParticles() {
    this.particles = []
    for(let i = 0; i < this.conf.numOfParticles; i++) {
      const life = (Math.random() * 0.75 + 0.25) * 2
      const particle = new Particle({
        position: new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ),
        velocity: new THREE.Vector3(0, 5, 0),
        size: (Math.random() * 0.5 + 0.5) * 4,
        life: life,
        maxLife: life,
      })

      this.particles.push(particle)
    }
  }

}




    