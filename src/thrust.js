import Env from './env'
import ParticleEngine from './particleEngine'

export default class Thrust {

  constructor() {
    this.env = new Env()
    this.scene = this.env.scene
    this.setParticleSystem()
  }

  setParticleSystem() {
    this.particleEngine = new ParticleEngine()
    this.scene.add(this.particleEngine.mesh)
  }

  update() {
    if(this.particleEngine) {
      this.particleEngine.update()
    }
  }

}