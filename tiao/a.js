return data.map((d) => {
    d.mj = new Intl.NumberFormat("en-US").format(d.mj)
  
    const mj = d.mj.split('.')
    if (mj.length === 1) {
      d.mj = d.mj + ".00"
    } else {
      if (mj[1].length === 1) {
        d.mj = d.mj + "0"
      }
    }
    return d
  })