/**
 * Calculates the Lk-norm of a vector
 * 
 * The Lk-norm is defined as:
 * ||x||_k = (|x_1|^k + |x_2|^k + ... + |x_n|^k)^(1/k)
 * 
 * @param {Array<number>} vector - The input vector
 * @param {number} k - The norm parameter
 * @returns {number} The Lk-norm value
 */
export const calculateLkNorm = (vector, k) => {
  // Special case for infinity norm
  if (k === Infinity) {
    return Math.max(...vector.map(x => Math.abs(x)))
  }
  
  // General case for finite k
  const sum = vector.reduce((acc, val) => acc + Math.pow(Math.abs(val), k), 0)
  return Math.pow(sum, 1/k)
}

/**
 * Generates points on the Lk-norm boundary in 2D
 * 
 * @param {number} k - The norm parameter
 * @param {number} numPoints - Number of points to generate
 * @returns {Array<{x: number, y: number}>} Array of points on the boundary
 */
export const generateLkNormBoundary2D = (k, numPoints = 360) => {
  const points = []
  
  for (let angle = 0; angle < 2 * Math.PI; angle += (2 * Math.PI) / numPoints) {
    // Start with a point on the unit circle
    let x = Math.cos(angle)
    let y = Math.sin(angle)
    
    // Scale to make it on the Lk-norm boundary where ||x||_k = 1
    const norm = calculateLkNorm([x, y], k)
    const scaleFactor = 1 / norm
    
    x *= scaleFactor
    y *= scaleFactor
    
    points.push({ x, y })
  }
  
  return points
}

/**
 * Converts spherical coordinates to Cartesian coordinates
 * 
 * @param {number} r - Radius
 * @param {number} theta - Azimuthal angle (0 to 2π)
 * @param {number} phi - Polar angle (0 to π)
 * @returns {{x: number, y: number, z: number}} Cartesian coordinates
 */
export const sphericalToCartesian = (r, theta, phi) => {
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.sin(phi) * Math.sin(theta),
    z: r * Math.cos(phi)
  }
}