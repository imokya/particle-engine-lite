export default class Tween {

  constructor(lerpFunc) {
    this._points = []
    this._lerpFun = lerpFunc
  }

  addTween(t, v) {
    this._points.push([
      t, v
    ])
  }

  getTween(t) {
    let p1 = 0
    for(let i = 0; i < this._points.length; i++) {
      if(this._points[i][0] >= t) {
        break
      }
      p1 = i
    }

    const p2 = Math.min(this._points.length - 1, p1 + 1)

    if(p1 == p2) {
      return this._points[p1][1]
    }

    const dt = (t - this._points[p1][0]) / (this._points[p2][0] - this._points[p1][0])
    
    return this._lerpFun(
      dt,
      this._points[p1][1],
      this._points[p2][1]  
    )

  }

}