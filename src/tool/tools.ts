export function createUuid(): string {
  const s: any[] = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    const m = Math.floor(Math.random() * 0x10);
    s[i] = hexDigits.slice(m, m + 1);
  }
  s[14] = "4";
  const n = (s[19] & 0x3) | 0x8;
  s[19] = hexDigits.slice(n, n + 1);
  s[8] = s[13] = s[18] = s[23] = "-";
  const uuid = s.join("");
  return uuid;
}

/**
 * Check whether shape2 is fully nested inside shape1. We only need to verify
 * that every point of shape2 lies inside shape1.
 * @param shape1 the outer shape
 * @param shape2 the inner shape
 * @return true if shape2 is nested inside shape1, false otherwise.
 */

export function isNested(shape1: any, shape2: any): boolean {
  if (shape1.type === 1 && shape2.type === 1) {
    // rect ⊆ rect
    const [[x1, y1], [x2, y2]] = shape1.coor;
    const [[x3, y3], [x4, y4]] = shape2.coor;

    // if (x1 >= x3 && y1 >= y3 && x2 <= x4 && y2 <= y4) {
    //   return true; // shape1 nested inside shape2
    // } else
    if (x1 <= x3 && y1 <= y3 && x2 >= x4 && y2 >= y4) {
      return true; // shape2 nested inside shape1
    } else {
      return false; // no nesting
    }
  } else if (shape1.type === 1 && shape2.type === 2) {
    // rect contains polygon: every polygon vertex must be inside the rect
    const [[x1, y1], [x2, y2]] = shape1.coor;
    const vertices = shape2.coor;

    for (let i = 0; i < vertices.length; i++) {
      const [x, y] = vertices[i];
      if (x < x1 || x > x2 || y < y1 || y > y2) {
        return false; // a polygon vertex falls outside the rect
      }
    }

    return true; // all vertices inside the rect
  } else if (shape1.type === 2 && shape2.type === 1) {
    // polygon contains rect: every rect corner must be inside the polygon
    const vertices = shape2.coor; // rect corners

    for (let i = 0; i < vertices.length; i++) {
      const [x, y] = vertices[i];
      if (!isPointInPolygon(x, y, shape1.coor)) {
        return false; // a corner is outside the polygon
      }
    }

    return true; // all corners are inside the polygon
  } else if (shape1.type === 2 && shape2.type === 2) {
    // polygon contains polygon
    const vertices1 = shape1.coor;
    const vertices2 = shape2.coor;

    for (let i = 0; i < vertices2.length; i++) {
      const [x, y] = vertices2[i];
      if (!isPointInPolygon(x, y, vertices1)) {
        return false; // a shape2 vertex is outside shape1
      }
    }

    return true; // every shape2 vertex is inside shape1
  }

  // Fall through for unsupported type combinations.
  return false;  // default
}

function isPointInPolygon(x: number, y: number, vertices: any) {
  let inside = false;
  const n = vertices.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = vertices[i][0];
    const yi = vertices[i][1];
    const xj = vertices[j][0];
    const yj = vertices[j][1];

    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
}
