import { useMemo } from "react";
import * as THREE from "three";
import FractalScene from "../../components/FractalScene";
import ControlPanel from "../../components/ControlPanel";

/* =========================
   バーンズリーのシダ 生成ロジック (IFS / カオスゲーム)
   ========================= */

/**
 * バーンズリーのシダを構成する4つのアフィン変換と各々の選択確率。
 * x' = a*x + b*y + e,  y' = c*x + d*y + f
 *
 * - f1 (1%):  茎
 * - f2 (85%): 連続して伸びていく小葉
 * - f3 (7%):  左側の大きな小葉
 * - f4 (7%):  右側の大きな小葉
 */
const TRANSFORMS = [
  { p: 0.01, a:  0.00, b:  0.00, c:  0.00, d: 0.16, e: 0, f: 0.00 },
  { p: 0.85, a:  0.85, b:  0.04, c: -0.04, d: 0.85, e: 0, f: 1.60 },
  { p: 0.07, a:  0.20, b: -0.26, c:  0.23, d: 0.22, e: 0, f: 1.60 },
  { p: 0.07, a: -0.15, b:  0.28, c:  0.26, d: 0.24, e: 0, f: 0.44 },
];

// 標準の Barnsley fern は x ≈ [-2.2, 2.7], y ≈ [0, 10] に分布する。
// シーンの [-1, 1] 程度に収まるよう中央寄せ＋スケーリングする係数。
const SCALE = 0.18;
const Y_OFFSET = -0.9;

/**
 * カオスゲームによりバーンズリーのシダの点群を生成する。
 * 反復回数は depth から指数的に決まる（1000 × 3^depth 点）。
 *
 * @param {number} depth - フラクタルの深さ（反復回数の指数）
 * @returns {Float32Array} [x,y,z, x,y,z, ...] 形式のポジション配列
 */
function generatePositions(depth) {
  const pointCount = Math.floor(1000 * Math.pow(3, depth));
  const positions = new Float32Array(pointCount * 3);

  let x = 0;
  let y = 0;

  for (let i = 0; i < pointCount; i++) {
    const r = Math.random();
    let cum = 0;
    let t = TRANSFORMS[TRANSFORMS.length - 1];
    for (const tr of TRANSFORMS) {
      cum += tr.p;
      if (r < cum) {
        t = tr;
        break;
      }
    }

    const nx = t.a * x + t.b * y + t.e;
    const ny = t.c * x + t.d * y + t.f;
    x = nx;
    y = ny;

    positions[i * 3]     = x * SCALE;
    positions[i * 3 + 1] = y * SCALE + Y_OFFSET;
    positions[i * 3 + 2] = 0;
  }

  return positions;
}

/* =========================
   コンポーネント
   ========================= */

/**
 * バーンズリーのシダの点群コンポーネント。
 * depth が 0 の場合は描画をスキップする。
 *
 * @param {{ depth: number }} props
 */
function BarnsleyFernPoints({ depth }) {
  const geometry = useMemo(() => {
    const positions = generatePositions(depth);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geom;
  }, [depth]);

  if (depth <= 0) return null;

  return (
    <points geometry={geometry}>
      <pointsMaterial color="#22c55e" size={0.012} sizeAttenuation />
    </points>
  );
}

/**
 * バーンズリーのシダの完全なシーン。
 */
export default function BarnsleyFern() {
  return (
    <ControlPanel maxDepth={5} defaultDepth={3} defaultInterval={500} enableWireframe={false}>
      {({ currentDepth }) => (
        <FractalScene>
          <BarnsleyFernPoints depth={currentDepth} />
        </FractalScene>
      )}
    </ControlPanel>
  );
}
