// Generate a UV-mapped sphere OBJ + MTL for Deliah's 3D avatar
const fs = require('fs');
const path = require('path');

const segments = 64;
const rings = 32;

const verts = [];
const uvs = [];
const normals = [];
const faces = [];

for (let y = 0; y <= rings; y++) {
  const v = y / rings;
  const theta = v * Math.PI;
  for (let x = 0; x <= segments; x++) {
    const u = x / segments;
    const phi = u * Math.PI * 2;
    const px = -Math.cos(phi) * Math.sin(theta);
    const py = Math.cos(theta);
    const pz = Math.sin(phi) * Math.sin(theta);
    verts.push([px, py, pz]);
    normals.push([px, py, pz]);
    uvs.push([u, 1 - v]);
  }
}

for (let y = 0; y < rings; y++) {
  for (let x = 0; x < segments; x++) {
    const a = y * (segments + 1) + x + 1;
    const b = a + 1;
    const c = a + (segments + 1);
    const d = c + 1;
    faces.push([a, b, d]);
    faces.push([a, d, c]);
  }
}

let obj = '# Deliah Avatar Sphere - UV mapped for deliah.jpeg\n';
obj += '# Generated for Genstro Intelligence\n';
obj += '# ' + verts.length + ' vertices, ' + faces.length + ' triangles\n';
obj += 'mtllib deliah.mtl\n';
obj += 'o DelihaSphere\n\n';

for (const [x, y, z] of verts) {
  obj += 'v ' + x.toFixed(6) + ' ' + y.toFixed(6) + ' ' + z.toFixed(6) + '\n';
}
obj += '\n';

for (const [u, v] of uvs) {
  obj += 'vt ' + u.toFixed(6) + ' ' + v.toFixed(6) + '\n';
}
obj += '\n';

for (const [x, y, z] of normals) {
  obj += 'vn ' + x.toFixed(6) + ' ' + y.toFixed(6) + ' ' + z.toFixed(6) + '\n';
}
obj += '\n';

obj += 'usemtl DelihaMaterial\n';
obj += 's 1\n';

for (const [a, b, c] of faces) {
  obj += 'f ' + a + '/' + a + '/' + a + ' ' + b + '/' + b + '/' + b + ' ' + c + '/' + c + '/' + c + '\n';
}

const outDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(outDir, 'deliah.obj'), obj);
console.log('OBJ: ' + verts.length + ' vertices, ' + faces.length + ' faces');

let mtl = '# Deliah Material - maps deliah.jpeg as diffuse texture\n';
mtl += 'newmtl DelihaMaterial\n';
mtl += 'Ka 0.2 0.2 0.2\n';
mtl += 'Kd 1.0 1.0 1.0\n';
mtl += 'Ks 0.3 0.3 0.3\n';
mtl += 'Ns 50.0\n';
mtl += 'd 1.0\n';
mtl += 'illum 2\n';
mtl += 'map_Kd deliah.jpeg\n';

fs.writeFileSync(path.join(outDir, 'deliah.mtl'), mtl);
console.log('MTL: written with deliah.jpeg texture');
console.log('Done.');
