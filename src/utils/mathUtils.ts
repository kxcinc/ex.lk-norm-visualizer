/**
 * Point in 2D space
 */
export interface Point2D {
  x: number;
  y: number;
}

/**
 * Point in 3D space
 */
export interface Point3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Calculates the Lk-norm of a vector
 *
 * The Lk-norm is defined as:
 * ||x||_k = (|x_1|^k + |x_2|^k + ... + |x_n|^k)^(1/k)
 *
 * @param vector - The input vector
 * @param k - The norm parameter
 * @returns The Lk-norm value
 */
export const calculateLkNorm = (vector: number[], k: number): number => {
  // Special case for infinity norm
  if (k === Number.POSITIVE_INFINITY) {
    return Math.max(...vector.map((x) => Math.abs(x)));
  }

  // General case for finite k
  const sum = vector.reduce((acc, val) => acc + Math.abs(val) ** k, 0);
  return sum ** (1 / k);
};

/**
 * Generates points on the Lk-norm boundary in 2D
 *
 * @param k - The norm parameter
 * @param numPoints - Number of points to generate
 * @returns Array of points on the boundary
 */
export const generateLkNormBoundary2D = (k: number, numPoints = 360): Point2D[] => {
  const points: Point2D[] = [];

  for (let angle = 0; angle < 2 * Math.PI; angle += (2 * Math.PI) / numPoints) {
    // Start with a point on the unit circle
    let x = Math.cos(angle);
    let y = Math.sin(angle);

    // Scale to make it on the Lk-norm boundary where ||x||_k = 1
    const norm = calculateLkNorm([x, y], k);
    const scaleFactor = 1 / norm;

    x *= scaleFactor;
    y *= scaleFactor;

    points.push({ x, y });
  }

  return points;
};

/**
 * Converts spherical coordinates to Cartesian coordinates
 *
 * @param r - Radius
 * @param theta - Azimuthal angle (0 to 2π)
 * @param phi - Polar angle (0 to π)
 * @returns Cartesian coordinates
 */
export const sphericalToCartesian = (r: number, theta: number, phi: number): Point3D => {
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.sin(phi) * Math.sin(theta),
    z: r * Math.cos(phi),
  };
};
