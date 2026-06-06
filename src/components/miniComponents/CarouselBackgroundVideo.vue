<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

// ── Colour palettes ──────────────────────────────────────────────
// Light: cyan-50  (#ecfeff)   Dark: slate-900 (#0f172a)
const PALETTE = {
light: {
    bg: '#ffffff',
    dotFill: 'rgba(8, 145, 178, 0.45)',       // lighter dots
    lineFill: 'rgba(8, 145, 178, {a})',
    symbolColor: (alpha: number) => `rgba(8, 145, 178, ${alpha})`,
    gridLine: 'rgba(8, 145, 178, 0.10)',
    orbitBorder: 'rgba(8, 145, 178, 0.4)',
    vignette: 'rgba(220, 245, 255, 0.3)',
},

    dark: {
        bg: '#0b1220',
        dotFill: 'rgba(125, 211, 252, 0.65)',
        lineFill: 'rgba(125, 211, 252, {a})',
        symbolColor: (alpha: number) =>
            `rgba(147, 197, 253, ${alpha})`,
        gridLine: 'rgba(125, 211, 252, 0.10)',
        orbitBorder: 'rgba(125, 211, 252, 0.22)',
        vignette: 'rgba(2, 6, 23, 0.65)',
    },
}

// ── Dark-mode detection ──────────────────────────────────────────
const isDark = ref(true)

let modeObserver: MutationObserver | null = null

// function observeColorScheme() {
//     modeObserver = new MutationObserver(() => {
//         isDark.value = document.documentElement.classList.contains('dark')
//         applyBackground()
//         rebuildCanvas()
//     })
//     modeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
// }

function palette() { return isDark.value ? PALETTE.dark : PALETTE.light }

// ── Math symbols ─────────────────────────────────────────────────
const mathSymbols = [
    'f(x) = ax² + bx + c', '∑ᵢ₌₀ⁿ xᵢ', '∂²u/∂t² = c²∇²u',
    'lim_{x→0} sin(x)/x = 1', '∇ × B = μ₀J', 'det(A) ≠ 0',
    'P(A|B) = P(B|A)·P(A)/P(B)', '∫∫_D f dA', 'φ = (1+√5)/2',
    "xₙ₊₁ = xₙ − f(xₙ)/f'(xₙ)", 'aₙ = a₁ + (n−1)d', '‖v‖ = √(v·v)',
    'Σ 1/n² = π²/6', 'e = Σ 1/n!', 'sin²θ + cos²θ = 1',
    'dS/dt = −βSI/N', 'z = a + bi', '|z|² = a² + b²',
    'A⁻¹A = I', 'rank(A) + null(A) = n', 'gcd(a,b)·lcm(a,b)=a·b',
    '∀ε>0 ∃δ>0', 'f: ℝ→ℝ', 'ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ',
    'n! = n·(n−1)!', 'C(n,k) = n!/(k!(n−k)!)', '2ⁿ > n² for n≥5',
    'tan(α+β) = ...', 'cosh²x − sinh²x = 1', 'i² = −1',
    '∞', 'π ≈ 3.14159...', '√2 is irrational', '0! = 1',
]

// ── Themes ───────────────────────────────────────────────────────
const themes = [
    { title: 'Mathematics', sub: 'explore · discover · prove', pills: ['∫₀^∞ e^(−x²) dx = √π/2', 'e^(iπ) + 1 = 0'] },
    { title: 'Algebra', sub: 'solve · factor · simplify', pills: ['ax² + bx + c = 0', 'x = (−b ± √Δ) / 2a'] },
    { title: 'Calculus', sub: 'limits · derivatives · integrals', pills: ['d/dx[xⁿ] = nxⁿ⁻¹', '∫ sin x dx = −cos x + C'] },
    { title: 'Geometry', sub: 'shape · space · proof', pills: ['a² + b² = c²', 'A = πr²'] },
    { title: 'Statistics', sub: 'data · probability · inference', pills: ['μ = (Σxᵢ)/n', 'P(A∪B) = P(A)+P(B)−P(A∩B)'] },
]

const themeIdx = ref(0)
const currentTitle = ref(themes[0].title)
const currentSub = ref(themes[0].sub)
const currentPills = ref([...themes[0].pills])

function cycleTitle() {
    themeIdx.value = (themeIdx.value + 1) % themes.length
    const t = themes[themeIdx.value]
    currentTitle.value = t.title
    currentSub.value = t.sub
    currentPills.value = [...t.pills]
}

// ── Template refs ────────────────────────────────────────────────
const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

let floatInterval: ReturnType<typeof setInterval> | null = null
let raf: number | null = null

// ── Apply background colour to container ─────────────────────────
function applyBackground() {
    if (containerRef.value)
        containerRef.value.style.background = isDark.value
            ? '#0b1220'
            : '#ffffff'
}

// ── Floating symbols ─────────────────────────────────────────────
function spawnSymbol() {
    if (!containerRef.value) return
    const el = document.createElement('div')
    el.className = 'cbv-float-symbol'
    el.textContent = mathSymbols[Math.floor(Math.random() * mathSymbols.length)]
    el.style.left = Math.random() * 92 + '%'
    el.style.bottom = '-30px'
    const dur = 9 + Math.random() * 10
    el.style.animationDuration = dur + 's'
    el.style.fontSize = (11 + Math.random() * 6) + 'px'
    const alpha = 0.08 + Math.random() * 0.22
    el.style.color = palette().symbolColor(alpha)
    containerRef.value.appendChild(el)
    setTimeout(() => el.remove(), dur * 1000 + 500)
}

// ── Canvas particles ──────────────────────────────────────────────
let dots: { x: number; y: number; vx: number; vy: number; r: number }[] = []

function rebuildCanvas() {
    const canvas = canvasRef.value
    const container = containerRef.value
    if (!canvas || !container) return

    // cancel current loop
    if (raf) { cancelAnimationFrame(raf); raf = null }

    canvas.width = container.offsetWidth
    canvas.height = container.offsetHeight

    dots = Array.from({ length: 55 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.30,
        vy: (Math.random() - 0.5) * 0.30,
        r: 1 + Math.random() * 1.5,
    }))

    const ctx = canvas.getContext('2d')!

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        const p = palette()

        dots.forEach(d => {
            d.x += d.vx; d.y += d.vy
            if (d.x < 0) d.x = canvas.width
            if (d.x > canvas.width) d.x = 0
            if (d.y < 0) d.y = canvas.height
            if (d.y > canvas.height) d.y = 0

            ctx.beginPath()
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
            ctx.fillStyle = p.dotFill
            ctx.fill()
        })

        for (let i = 0; i < dots.length; i++) {
            for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].x - dots[j].x
                const dy = dots[i].y - dots[j].y
                const dist = Math.sqrt(dx * dx + dy * dy)
                if (dist < 100) {
                    const a = 0.25 * (1 - dist / 100)
                    ctx.beginPath()
                    ctx.moveTo(dots[i].x, dots[i].y)
                    ctx.lineTo(dots[j].x, dots[j].y)
                    ctx.strokeStyle = p.lineFill.replace('{a}', String(a))
                    ctx.lineWidth = 0.5
                    ctx.stroke()
                }
            }
        }

        raf = requestAnimationFrame(animate)
    }
    animate()
}

onMounted(() => {
    applyBackground()
    rebuildCanvas()
    floatInterval = setInterval(spawnSymbol, 400)
    // observeColorScheme()
})

onUnmounted(() => {
    if (floatInterval) clearInterval(floatInterval)
    if (raf) cancelAnimationFrame(raf)
    if (modeObserver) modeObserver.disconnect()
})
</script>

<template>
    <div ref="containerRef" class="cbv-root" aria-hidden="true">

        <!-- Grid -->
        <div class="cbv-grid" />

        <!-- Particles canvas -->
        <canvas ref="canvasRef" class="cbv-canvas" />

        <!-- Orbit rings -->
        <div class="cbv-ring" style="width:280px;height:280px;top:50%;left:50%;animation-duration:20s;" />
        <div class="cbv-ring"
            style="width:440px;height:220px;top:50%;left:50%;animation-duration:28s;animation-direction:reverse;" />
        <div class="cbv-ring" style="width:560px;height:560px;top:50%;left:50%;animation-duration:44s;" />

        <!-- Soft radial vignette -->
        <div class="cbv-vignette" />

        <!-- Decorative blobs -->
        <div class="cbv-blob cbv-blob--tl" />
        <div class="cbv-blob cbv-blob--br" />

        <!-- Centre text overlay -->
        <div class="cbv-center">
            <div class="cbv-title">{{ currentTitle }}</div>
            <div class="cbv-subtitle">{{ currentSub }}</div>
            <div class="cbv-pills">
                <div v-for="pill in currentPills" :key="pill" class="cbv-pill">{{ pill }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Fira+Code:wght@300;400&display=swap');

/* ── Root ─────────────────────────────────────────────────────── */
.cbv-root {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    font-family: 'Fira Code', monospace;
    /* background is set inline by applyBackground() */
    transition: background 0.4s ease;
}

/* ── Canvas ───────────────────────────────────────────────────── */
.cbv-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
}

/* ── Floating symbols (spawned via JS) ────────────────────────── */
:deep(.cbv-float-symbol) {
    position: absolute;
    font-family: 'Fira Code', monospace;
    font-weight: 300;
    pointer-events: none;
    white-space: nowrap;
    animation: cbvFloatUp linear infinite;
    animation-delay: 0s;
}

@keyframes cbvFloatUp {
    0% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0;
    }

    8% {
        opacity: 1;
    }

    88% {
        opacity: 0.85;
    }

    100% {
        transform: translateY(-580px) rotate(6deg);
        opacity: 0;
    }
}

/* ── Grid overlay ─────────────────────────────────────────────── */
.cbv-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

/* Light mode grid */
.cbv-grid {
    background-image:
        linear-gradient(rgba(100, 200, 220, 0.12) 1px, transparent 1px),
        linear-gradient(90deg, rgba(100, 200, 220, 0.12) 1px, transparent 1px);
}
/* Dark mode grid */
:global(.dark) .cbv-grid {
    background-image:
        linear-gradient(rgba(125, 211, 252, 0.10) 1px, transparent 1px),
        linear-gradient(90deg, rgba(125, 211, 252, 0.10) 1px, transparent 1px);
}

/* ── Orbit rings ──────────────────────────────────────────────── */
.cbv-ring {
    position: absolute;
    border-radius: 50%;
    animation: cbvSpin linear infinite;

    border: 2px solid rgba(8, 145, 178, 0.9);
    box-shadow:
        0 0 6px 2px rgba(8, 145, 178, 0.8),
        0 0 18px 4px rgba(6, 182, 212, 0.55),
        0 0 45px 10px rgba(6, 182, 212, 0.30),
        inset 0 0 8px 2px rgba(8, 145, 178, 0.25);
}

/* Dark mode: pure white with strong glow */
:global(.dark) .cbv-ring {
    border: 2px solid rgba(255, 255, 255, 1);

    box-shadow:
        0 0 6px 2px rgba(255, 255, 255, 0.95),
        0 0 20px 5px rgba(255, 255, 255, 0.65),
        0 0 50px 10px rgba(120, 180, 255, 0.45),
        0 0 80px 15px rgba(80, 140, 255, 0.2),
        inset 0 0 8px 2px rgba(255, 255, 255, 0.3);
}

@keyframes cbvSpin {
    from {
        transform: translate(-50%, -50%) rotate(0deg);
    }

    to {
        transform: translate(-50%, -50%) rotate(360deg);
    }
}

/* ── Vignette ─────────────────────────────────────────────────── */
.cbv-vignette {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 5;
}

:global(.dark) .cbv-vignette {
    background: radial-gradient(ellipse at center, transparent 30%, rgba(5, 5, 20, 0.65) 100%);
}

/* ── Decorative blobs ─────────────────────────────────────────── */
.cbv-blob {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    z-index: 2;
    filter: blur(70px);
    animation: cbvPulse 8s ease-in-out infinite;
}

.cbv-blob--tl {
    width: 320px;
    height: 320px;
    top: -80px;
    left: -80px;
    /* Light: soft cyan */
    background: radial-gradient(circle, rgba(6, 182, 212, 0.20) 0%, transparent 70%);
}

:global(.dark) .cbv-blob--tl {
    background: radial-gradient(circle, rgba(56, 100, 220, 0.18) 0%, transparent 70%);
}

.cbv-blob--br {
    width: 360px;
    height: 360px;
    bottom: -100px;
    right: -80px;
    /* Light: soft sky blue */
    background: radial-gradient(circle, rgba(14, 165, 233, 0.18) 0%, transparent 70%);
    animation-delay: -4s;
}

:global(.dark) .cbv-blob--br {
    background: radial-gradient(circle, rgba(99, 60, 200, 0.16) 0%, transparent 70%);
}

@keyframes cbvPulse {

    0%,
    100% {
        opacity: 0.8;
        transform: scale(1);
    }

    50% {
        opacity: 1;
        transform: scale(1.12);
    }
}

/* ── Centre text ──────────────────────────────────────────────── */
.cbv-center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    z-index: 10;
    pointer-events: none;
}

.cbv-title {
    font-family: 'Playfair Display', serif;
    font-size: 42px;
    font-weight: 700;
    letter-spacing: 2px;
    animation: cbvTitlePulse 4s ease-in-out infinite;
    /* Light: deep cyan */
    color: #a8f0e8;
    text-shadow: 0 0 40px rgba(100, 220, 210, 0.6), 0 0 80px rgba(60, 180, 220, 0.3);
}

:global(.dark) .cbv-title {
    color: #ffffff;
    text-shadow: 0 0 40px rgba(100, 180, 255, 0.6), 0 0 80px rgba(80, 120, 255, 0.3);
}

@keyframes cbvTitlePulse {

    0%,
    100% {
        opacity: 0.9;
    }

    50% {
        opacity: 1;
    }
}

.cbv-subtitle {
    font-family: 'Fira Code', monospace;
    font-size: 12px;
    letter-spacing: 6px;
    text-transform: uppercase;
    /* Light */
    color: rgba(140, 230, 255, 0.8);
}

:global(.dark) .cbv-subtitle {
    color: rgba(160, 200, 255, 0.7);
}

.cbv-pills {
    display: flex;
    gap: 20px;
    margin-top: 8px;
    flex-wrap: wrap;
    justify-content: center;
    animation: cbvFade 6s ease-in-out infinite;
}

@keyframes cbvFade {

    0%,
    100% {
        opacity: 0.55;
    }

    50% {
        opacity: 1;
    }
}

.cbv-pill {
    border-radius: 20px;
    padding: 5px 16px;
    font-size: 13px;
    font-family: 'Fira Code', monospace;
    /* Light */
background: rgba(80, 200, 220, 0.12);
    border: 1px solid rgba(100, 220, 240, 0.35);
    color: rgba(160, 240, 255, 0.9);
}

:global(.dark) .cbv-pill {
    background: rgba(80, 140, 255, 0.12);
    border: 1px solid rgba(100, 160, 255, 0.25);
    color: rgba(160, 220, 255, 0.85);
}

/* ── Controls ─────────────────────────────────────────────────── */
.cbv-controls {
    position: absolute;
    bottom: 14px;
    right: 16px;
    z-index: 20;
}

.cbv-btn {
    border-radius: 8px;
    font-size: 12px;
    font-family: 'Fira Code', monospace;
    padding: 5px 14px;
    cursor: pointer;
    transition: background 0.2s;
    /* Light */
    background: rgba(6, 182, 212, 0.10);
    border: 1px solid rgba(6, 182, 212, 0.30);
    color: rgba(8, 145, 178, 0.9);
}

:global(.dark) .cbv-btn {
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: rgba(200, 220, 255, 0.9);
}

.cbv-btn:hover {
    background: rgba(6, 182, 212, 0.20);
}

:global(.dark) .cbv-btn:hover {
    background: rgba(255, 255, 255, 0.15);
}
</style>