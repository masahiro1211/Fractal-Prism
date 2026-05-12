// Three.js のビルトイン uniform (modelMatrix, viewMatrix, projectionMatrix) は
// ShaderMaterial が自動で注入する。
// 平面メッシュ(planeGeometry)に貼ることで、頂点のワールド座標 xy がそのまま
// 複素平面上の点 c に対応する。

export const vertexShader = /* glsl */ `
varying vec2 vCoord;
void main() {
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vCoord = worldPos.xy;
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const fragmentShader = /* glsl */ `
precision highp float;

varying vec2 vCoord;

uniform float uMaxIterF;
uniform float uBailout;

// 反復回数の上限。ControlPanel の maxDepth と合わせる。
const int MAX_ITER_CONST = 360;

void main() {
  vec2 c = vCoord;
  vec2 z = vec2(0.0);
  float bailout2 = uBailout * uBailout;
  int maxIter = int(uMaxIterF);

  float iter = 0.0;
  bool escaped = false;
  float radius = 0.0;

  for (int i = 0; i < MAX_ITER_CONST; i++) {
    if (i >= maxIter) break;
    float x2 = z.x * z.x;
    float y2 = z.y * z.y;
    float r2 = x2 + y2;
    if (r2 > bailout2) {
      escaped = true;
      radius = sqrt(r2);
      break;
    }
    z = vec2(x2 - y2 + c.x, 2.0 * z.x * z.y + c.y);
    iter = float(i + 1);
  }

  if (!escaped) {
    // 集合内部: 暗い色
    gl_FragColor = vec4(5.0 / 255.0, 7.0 / 255.0, 20.0 / 255.0, 1.0);
    return;
  }

  // 滑らかな反復回数 (mandelbrotMath.js の writeColor と同じ式)
  float smoothIter = iter + 1.0 - log2(max(1.0, log2(max(radius, 1.0001))));
  float t = clamp(smoothIter / uMaxIterF, 0.0, 1.0);
  float glow = pow(t, 0.58);
  float band = 0.5 + 0.5 * sin(18.0 * t + uBailout * 0.75);

  float r = (1.0 + 42.0 * glow + 96.0 * glow * band) / 255.0;
  float g = (1.0 + 68.0 * glow + 120.0 * pow(t, 1.15) * (1.0 - band * 0.25)) / 255.0;
  float b = (30.0 + 72.0 * glow + 96.0 * glow * band) / 255.0;

  gl_FragColor = vec4(r, g, b, 1.0);
}
`;
