import {
  Fragment,
  computed,
  createBaseVNode,
  createBlock,
  createCommentVNode,
  createElementBlock,
  defineComponent,
  guardReactiveProps,
  nextTick,
  normalizeClass,
  normalizeProps,
  normalizeStyle,
  onBeforeUnmount,
  onMounted,
  openBlock,
  ref,
  renderList,
  renderSlot,
  resolveDynamicComponent,
  unref,
  watch,
  withCtx,
  withModifiers
} from "./chunk-5A4OAFVX.js";

// node_modules/es-drager/lib/index.es.js
var $e = {
  tag: {
    type: [String, Object],
    default: "div"
  },
  resizable: {
    type: Boolean,
    default: true
  },
  rotatable: {
    type: Boolean,
    default: false
  },
  boundary: {
    // 边界
    type: Boolean
  },
  disabled: Boolean,
  width: {
    type: Number,
    default: 0
  },
  height: {
    type: Number,
    default: 0
  },
  left: {
    type: Number,
    default: 0
  },
  top: {
    type: Number,
    default: 0
  },
  zIndex: {
    type: Number,
    default: 0
  },
  angle: {
    type: Number,
    default: 0
  },
  color: {
    type: String,
    default: "#3a7afe"
  },
  minWidth: {
    type: Number,
    default: -1 / 0
  },
  minHeight: {
    type: Number,
    default: -1 / 0
  },
  maxWidth: {
    type: Number,
    default: 0
  },
  maxHeight: {
    type: Number,
    default: 0
  },
  aspectRatio: {
    // 缩放比例
    type: Number
  },
  selected: Boolean,
  snapToGrid: Boolean,
  gridX: {
    type: Number,
    default: 50
  },
  gridY: {
    type: Number,
    default: 50
  },
  scaleRatio: {
    type: Number,
    default: 1
  },
  disabledKeyEvent: Boolean,
  border: {
    type: Boolean,
    default: true
    // 兼容默认
  },
  resizeList: {
    type: Array
    // 要显示的缩放handle列表，默认显示全部
  },
  equalProportion: {
    // 是否等比例缩放
    type: Boolean
  },
  checkCollision: {
    // 是否开启碰撞检查
    type: Boolean
  },
  snap: Boolean,
  // 是否开启吸附
  snapThreshold: {
    // 吸附阈值，默认10px
    type: Number,
    default: 10
  },
  markline: [Boolean, Function]
  // 辅助线
};
function te(o, n) {
  const e = (t) => {
    n && n(t), document.removeEventListener("mousemove", o), document.removeEventListener("mouseup", e), document.removeEventListener("mouseleave", e), document.removeEventListener("touchmove", o), document.removeEventListener("touchend", e);
  };
  document.addEventListener("mousemove", o), document.addEventListener("mouseup", e), document.addEventListener("mouseleave", e), document.addEventListener("touchmove", o), document.addEventListener("touchend", e);
}
function V(o) {
  let n = 0, e = 0;
  if (Ve(o)) {
    const t = o.targetTouches[0];
    n = t.pageX, e = t.pageY;
  } else
    n = o.clientX, e = o.clientY;
  return { clientX: n, clientY: e };
}
function Ve(o) {
  const n = Object.prototype.toString.call(o);
  return n.substring(8, n.length - 1) === "TouchEvent";
}
var F = (o = 0) => parseInt(o + "") + "px";
var H = {
  n: "top",
  s: "bottom",
  e: "right",
  w: "left",
  ne: "top-right",
  nw: "top-left",
  se: "bottom-right",
  sw: "bottom-left"
};
var ee = ["n", "ne", "e", "se", "s", "sw", "w", "nw"];
var Ge = { n: 0, ne: 1, e: 2, se: 3, s: 4, sw: 5, w: 6, nw: 7 };
var qe = {
  0: 0,
  1: 1,
  2: 2,
  3: 2,
  4: 3,
  5: 4,
  6: 4,
  7: 5,
  8: 6,
  9: 6,
  10: 7,
  11: 8
};
var Fe = (o, n) => {
  const e = qe[Math.floor(o / 30)], i = (Ge[n] + e) % 8;
  return ee[i];
};
var ve = (o = 0, n) => {
  let e = [];
  for (let t = 0; t < ee.length; t++) {
    const i = ee[t], [h, d] = H[i].split("-"), s = Fe(o, i), c = {
      [h]: "0%",
      cursor: s + "-resize",
      side: H[i]
    };
    if (d)
      c[d] = "0%";
    else {
      const g = ["top", "bottom"].includes(h) ? "left" : "top";
      c[g] = "50%";
    }
    n ? n.includes(H[i]) && e.push(c) : e.push(c);
  }
  return e;
};
var ne = (o) => o * Math.PI / 180;
var Ue = (o, n) => Math.sqrt(o * o + n * n);
var k = (o) => Math.cos(ne(o));
var L = (o) => Math.sin(ne(o));
var Oe = (o, n, e, t, i, h, d) => {
  let { width: s, height: c, centerX: g, centerY: w, rotateAngle: l } = n;
  const x = s < 0 ? -1 : 1, v = c < 0 ? -1 : 1;
  switch (s = Math.abs(s), c = Math.abs(c), o) {
    case "right": {
      const u = I(s, e, h);
      s = u.width, e = u.deltaW, i ? (t = e / i, c = s / i, g += e / 2 * k(l) - t / 2 * L(l), w += e / 2 * L(l) + t / 2 * k(l)) : (g += e / 2 * k(l), w += e / 2 * L(l));
      break;
    }
    case "top-right": {
      t = -t;
      const u = I(s, e, h);
      s = u.width, e = u.deltaW;
      const r = P(c, t, d);
      c = r.height, t = r.deltaH, i && (e = t * i, s = c * i), g += e / 2 * k(l) + t / 2 * L(l), w += e / 2 * L(l) - t / 2 * k(l);
      break;
    }
    case "bottom-right": {
      const u = I(s, e, h);
      s = u.width, e = u.deltaW;
      const r = P(c, t, d);
      c = r.height, t = r.deltaH, i && (e = t * i, s = c * i), g += e / 2 * k(l) - t / 2 * L(l), w += e / 2 * L(l) + t / 2 * k(l);
      break;
    }
    case "bottom": {
      const u = P(c, t, d);
      c = u.height, t = u.deltaH, i ? (e = t * i, s = c * i, g += e / 2 * k(l) - t / 2 * L(l), w += e / 2 * L(l) + t / 2 * k(l)) : (g -= t / 2 * L(l), w += t / 2 * k(l));
      break;
    }
    case "bottom-left": {
      e = -e;
      const u = I(s, e, h);
      s = u.width, e = u.deltaW;
      const r = P(c, t, d);
      c = r.height, t = r.deltaH, i && (c = s / i, t = e / i), g -= e / 2 * k(l) + t / 2 * L(l), w -= e / 2 * L(l) - t / 2 * k(l);
      break;
    }
    case "left": {
      e = -e;
      const u = I(s, e, h);
      s = u.width, e = u.deltaW, i ? (c = s / i, t = e / i, g -= e / 2 * k(l) + t / 2 * L(l), w -= e / 2 * L(l) - t / 2 * k(l)) : (g -= e / 2 * k(l), w -= e / 2 * L(l));
      break;
    }
    case "top-left": {
      e = -e, t = -t;
      const u = I(s, e, h);
      s = u.width, e = u.deltaW;
      const r = P(c, t, d);
      c = r.height, t = r.deltaH, i && (s = c * i, e = t * i), g -= e / 2 * k(l) - t / 2 * L(l), w -= e / 2 * L(l) + t / 2 * k(l);
      break;
    }
    case "top": {
      t = -t;
      const u = P(c, t, d);
      c = u.height, t = u.deltaH, i ? (s = c * i, e = t * i, g += e / 2 * k(l) + t / 2 * L(l), w += e / 2 * L(l) - t / 2 * k(l)) : (g += t / 2 * L(l), w -= t / 2 * k(l));
      break;
    }
  }
  return {
    position: {
      centerX: g,
      centerY: w
    },
    size: {
      width: s * x,
      height: c * v
    }
  };
};
var P = (o, n, e) => {
  const t = o + n;
  return t > e ? o = t : (n = e - o, o = e), { height: o, deltaH: n };
};
var I = (o, n, e) => {
  const t = o + n;
  return t > e ? o = t : (n = e - o, o = e), { width: o, deltaW: n };
};
var je = ({
  centerX: o,
  centerY: n,
  width: e,
  height: t,
  angle: i
}) => ({
  top: n - t / 2,
  left: o - e / 2,
  width: e,
  height: t,
  angle: i
});
var Je = (o, n, e) => {
  const { width: t, height: i } = o;
  return {
    width: Math.abs(t),
    height: Math.abs(i),
    left: n - Math.abs(t) / 2,
    top: e - Math.abs(i) / 2
  };
};
function J(o, n) {
  const e = Math.abs(o) % n, t = o > 0 ? n : -n;
  let i = 0;
  return e > n / 2 ? i = t * Math.ceil(Math.abs(o) / n) : i = t * Math.floor(Math.abs(o) / n), i;
}
function Qe(o, n, e) {
  if (!o || !n)
    return false;
  const t = B(o, e), i = B(n, e);
  return t.left < i.left + i.width && t.left + t.width > i.left && t.top < i.top + i.height && t.top + t.height > i.top;
}
var B = (o, n) => {
  var e = o.getBoundingClientRect();
  return {
    ...e,
    left: e.left / n,
    top: e.top / n,
    right: e.right / n,
    bottom: e.bottom / n,
    width: e.width / n,
    height: e.height / n
  };
};
var ye = (o) => typeof o == "function";
function Ze(o, n) {
  let e = null, t = null;
  const i = computed(() => o.value.offsetParent || document.body), h = computed(() => B(i.value, n.scaleRatio)), d = ref({ x: [], y: [] }), s = () => {
    n.markline && !ye(n.markline) && (e || (e = document.querySelector(".es-drager-markline-x") || me("x", i.value, n.color)), t || (t = document.querySelector(".es-drager-markline-y") || me("y", i.value, n.color)));
  }, c = (v = {}) => {
    if (n.markline) {
      if (ye(n.markline))
        return n.markline(v);
      v.left === null ? e.style.display = "none" : (e.style.left = v.left + "px", e.style.backgroundColor = n.color, e.style.display = "block"), v.top === null ? t.style.display = "none" : (t.style.top = v.top + "px", t.style.backgroundColor = n.color, t.style.display = "block");
    }
  }, g = () => {
    const v = B(o.value, n.scaleRatio), u = document.querySelectorAll(".es-drager"), r = [];
    for (let f = 0; f < u.length; f++) {
      const m = u[f];
      m !== o.value && r.push(B(m, n.scaleRatio));
    }
    d.value = He(r, v);
  }, w = () => {
    const v = {
      top: null,
      left: null,
      diffX: 0,
      diffY: 0
    }, u = B(o.value, n.scaleRatio);
    for (let r = 0; r < d.value.y.length; r++) {
      const { top: f, showTop: m } = d.value.y[r];
      if (Math.abs(f - u.top) < n.snapThreshold) {
        v.diffY = f - u.top, v.top = m - h.value.top;
        break;
      }
    }
    for (let r = 0; r < d.value.x.length; r++) {
      const { left: f, showLeft: m } = d.value.x[r];
      if (Math.abs(f - u.left) < n.snapThreshold) {
        v.diffX = f - u.left, v.left = m - h.value.left;
        break;
      }
    }
    return c(v), v;
  }, l = () => {
    c({ left: null, top: null });
  }, x = (v) => {
    if (!(!n.snap && !n.markline))
      switch (v) {
        case "drag-start":
          g();
          break;
        case "drag":
          return w();
        case "drag-end":
          l();
          break;
      }
  };
  return onMounted(() => {
    s();
  }), {
    marklineEmit: x
  };
}
function me(o = "x", n, e = "") {
  const t = document.createElement("div");
  return t.classList.add(`es-drager-markline-${o}`), t.style.position = "absolute", t.style.top = "0px", t.style.left = "0px", t.style.zIndex = "9999", t.style.backgroundColor = e, t.style.display = "none", o === "x" ? (t.style.height = "100%", t.style.width = "1px") : (t.style.height = "1px", t.style.width = "100%"), n.appendChild(t), t;
}
function He(o, n) {
  const e = { x: [], y: [] }, { width: t = 0, height: i = 0 } = n;
  return o.forEach((h) => {
    const {
      top: d,
      left: s,
      width: c,
      height: g
    } = h;
    e.y.push({ showTop: d, top: d }), e.y.push({ showTop: d, top: d - i }), e.y.push({
      showTop: d + g / 2,
      top: d + g / 2 - i / 2
    }), e.y.push({ showTop: d + g, top: d + g }), e.y.push({ showTop: d + g, top: d + g - i }), e.x.push({ showLeft: s, left: s }), e.x.push({ showLeft: s + c, left: s + c }), e.x.push({
      showLeft: s + c / 2,
      left: s + c / 2 - t / 2
    }), e.x.push({ showLeft: s + c, left: s + c - t }), e.x.push({ showLeft: s, left: s - t });
  }), e;
}
function We(o, n, e, {
  getBoundary: t,
  fixBoundary: i,
  checkDragerCollision: h,
  emit: d
}) {
  let s = 0, c = 0;
  return {
    onKeydown: (l) => {
      let { left: x, top: v } = n.value;
      if (s || (s = x), c || (c = v), ["ArrowRight", "ArrowLeft"].includes(l.key)) {
        const u = l.key === "ArrowRight";
        let r = u ? 1 : -1;
        o.snapToGrid && (r = u ? o.gridX : -o.gridX), x = x + r;
      } else if (["ArrowUp", "ArrowDown"].includes(l.key)) {
        const u = l.key === "ArrowDown";
        let r = u ? 1 : -1;
        o.snapToGrid && (r = u ? o.gridY : -o.gridY), v = v + r;
      }
      if (o.boundary) {
        const [u, r, f, m] = t();
        [x, v] = i(x, v, u, r, f, m);
      }
      n.value.left = x, n.value.top = v;
    },
    onKeyup: (l) => {
      ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(l.key) && o.checkCollision && h() && (n.value.left = s, n.value.top = c), s = 0, c = 0;
    }
  };
}
function et(o, n, e) {
  const t = ref(false), i = ref(false), h = ref({
    width: n.width,
    height: n.height,
    left: n.left,
    top: n.top,
    angle: n.angle
  }), { marklineEmit: d } = Ze(o, n), s = /* @__PURE__ */ new Set();
  function c(r) {
    if (s.add(r.button), n.disabled)
      return;
    t.value = true, i.value = true;
    let { clientX: f, clientY: m } = V(r);
    const { left: E, top: a } = h.value;
    let y = 0, p = 0, M = 0, b = 0;
    n.boundary && ([y, p, M, b] = g()), d("drag-start"), e && e("drag-start", h.value), te((Y) => {
      if (s.size > 1)
        return;
      const { clientX: A, clientY: D } = V(Y);
      let z = (A - f) / n.scaleRatio + E, R = (D - m) / n.scaleRatio + a;
      if (n.snapToGrid) {
        let { left: T, top: C } = h.value;
        const Q = z - T, Z = R - C;
        z = T + J(Q, n.gridX), R = C + J(Z, n.gridY);
      }
      n.boundary && ([z, R] = w(z, R, y, p, M, b)), h.value.left = z, h.value.top = R, e && e("drag", h.value), nextTick(() => {
        const T = d("drag");
        n.snap && (T.diffX && (h.value.left += T.diffX), T.diffY && (h.value.top += T.diffY));
      });
    }, (Y) => {
      n.checkCollision && l() && (h.value.top = a, h.value.left = E), s.clear(), t.value = false, d("drag-end"), e && e("drag-end", h.value);
    });
  }
  const g = () => {
    let r = 0, f = 0;
    const { left: m, top: E, height: a, width: y, angle: p } = h.value, M = o.value.offsetParent || document.body, b = B(M, n.scaleRatio);
    if (p) {
      const A = B(o.value, n.scaleRatio);
      r = A.left - Math.floor(m - (A.width - y) + b.left), f = A.top - Math.floor(E - (A.height - a) + b.top);
    }
    const X = b.width - y, Y = b.height - a;
    return [r, X - r, f, Y - f, b.width, b.height];
  }, w = (r, f, m, E, a, y) => (r = r < m ? m : r, r = r > E ? E : r, f = f < a ? a : f, f = f > y ? y : f, [r, f]), l = () => {
    const r = o.value.offsetParent || document.body, f = Array.from(r.children).filter((m) => m !== o.value && m.classList.contains("es-drager"));
    for (let m = 0; m < f.length; m++) {
      const E = f[m];
      if (Qe(o.value, E, n.scaleRatio))
        return true;
    }
  }, x = () => {
    i.value = false;
  }, { onKeydown: v, onKeyup: u } = We(
    n,
    h,
    i,
    {
      getBoundary: g,
      fixBoundary: w,
      checkDragerCollision: l,
      emit: e
    }
  );
  return watch(i, (r) => {
    r ? (e("focus", r), document.addEventListener("click", x, { once: true })) : e("blur", r), !n.disabledKeyEvent && (r ? (document.addEventListener("keydown", v), document.addEventListener("keyup", u)) : (document.removeEventListener("keydown", v), document.removeEventListener("keyup", u)));
  }), onMounted(() => {
    if (o.value) {
      if (!h.value.width && !h.value.height) {
        const { width: r, height: f } = B(o.value, n.scaleRatio);
        h.value = {
          ...h.value,
          width: r || 100,
          height: f || 100
        };
      }
      o.value.addEventListener("mousedown", c), o.value.addEventListener("touchstart", c, {
        passive: true
      });
    }
  }), onBeforeUnmount(() => {
    document.removeEventListener("click", x), document.removeEventListener("keydown", v), document.removeEventListener("keyup", u);
  }), {
    isMousedown: t,
    selected: i,
    dragData: h,
    getBoundary: g,
    checkDragerCollision: l
  };
}
var tt = createBaseVNode("div", { class: "es-drager-rotate-handle" }, [
  createBaseVNode("svg", {
    viewBox: "0 0 1024 1024",
    xmlns: "http://www.w3.org/2000/svg"
  }, [
    createBaseVNode("path", {
      fill: "currentColor",
      d: "M784.512 230.272v-50.56a32 32 0 1 1 64 0v149.056a32 32 0 0 1-32 32H667.52a32 32 0 1 1 0-64h92.992A320 320 0 1 0 524.8 833.152a320 320 0 0 0 320-320h64a384 384 0 0 1-384 384 384 384 0 0 1-384-384 384 384 0 0 1 643.712-282.88z"
    })
  ])
], -1);
var nt = defineComponent({
  __name: "rotate",
  props: {
    modelValue: {
      type: Number,
      default: 0
    },
    element: {
      type: Object
    }
  },
  emits: [
    "update:modelValue",
    "rotate",
    "rotate-start",
    "rotate-end"
  ],
  setup(o, { emit: n }) {
    const e = o, t = n, i = ref(null), h = computed({
      get: () => e.modelValue,
      set: (s) => {
        t("update:modelValue", s);
      }
    });
    function d(s) {
      if (!e.element)
        return console.warn(
          "[es-drager] rotate component need drag element property"
        );
      s.stopPropagation();
      const { width: c, height: g, left: w, top: l } = e.element.getBoundingClientRect(), x = w + c / 2, v = l + g / 2;
      t("rotate-start", h.value), te(
        (u) => {
          const { clientX: r, clientY: f } = V(u), m = x - r, E = v - f, y = Math.atan2(E, m) * 180 / Math.PI - 90;
          h.value = (y + 360) % 360, t("rotate", h.value);
        },
        () => {
          t("rotate-end", h.value);
        }
      );
    }
    return (s, c) => (openBlock(), createElementBlock("div", {
      ref_key: "rotateRef",
      ref: i,
      class: "es-drager-rotate",
      onMousedown: d,
      onTouchstartPassive: d
    }, [
      renderSlot(s.$slots, "default", {}, () => [
        tt
      ])
    ], 544));
  }
});
var ot = ["data-side", "onMousedown", "onTouchstartPassive"];
var st = createBaseVNode("div", { class: "es-drager-dot-handle" }, null, -1);
var be = defineComponent({
  __name: "drager",
  props: $e,
  emits: [
    "change",
    "drag",
    "drag-start",
    "drag-end",
    "resize",
    "resize-start",
    "resize-end",
    "rotate",
    "rotate-start",
    "rotate-end",
    "focus",
    "blur"
  ],
  setup(o, { emit: n }) {
    const e = o, t = n, i = (a, ...y) => {
      t(a, ...y);
    }, h = ref(null), { selected: d, dragData: s, isMousedown: c, getBoundary: g, checkDragerCollision: w } = et(
      h,
      e,
      i
    ), l = ref(ve(0, e.resizeList)), x = computed(() => e.resizable && !e.disabled), v = computed(
      () => e.rotatable && !e.disabled && d.value
    ), u = computed(() => {
      const { width: a, height: y, left: p, top: M, angle: b } = s.value, X = {};
      return a && (X.width = F(a)), y && (X.height = F(y)), {
        ...X,
        left: F(p),
        top: F(M),
        zIndex: e.zIndex,
        transform: `rotate(${b}deg)`,
        "--es-drager-color": e.color
      };
    });
    function r(a) {
      h.value || (h.value = a.$el || a);
    }
    function f(a) {
      l.value = ve(a, e.resizeList), i("rotate-end", s.value);
    }
    function m(a, y) {
      if (e.disabled)
        return;
      y.stopPropagation();
      const { clientX: p, clientY: M } = V(y), b = p, X = M, { width: Y, height: A, left: D, top: z } = s.value, R = D + Y / 2, T = z + A / 2, C = {
        width: Y,
        height: A,
        centerX: R,
        centerY: T,
        rotateAngle: s.value.angle
      }, Q = a.side, { minWidth: Z, minHeight: ke, aspectRatio: oe, equalProportion: Le } = e;
      i("resize-start", s.value);
      let se = [];
      e.boundary && (se = g()), te((ie) => {
        const { clientX: xe, clientY: Me } = V(ie);
        let G = (xe - b) / e.scaleRatio, q = (Me - X) / e.scaleRatio;
        e.snapToGrid && (G = J(G, e.gridX), q = J(q, e.gridY));
        const Ae = Math.atan2(q, G), le = Ue(G, q), Ee = ie.shiftKey, re = Ae - ne(C.rotateAngle), Xe = le * Math.cos(re), Ye = le * Math.sin(re), ae = (Le || Ee) && !oe ? C.width / C.height : oe, {
          position: { centerX: ce, centerY: ue },
          size: { width: ze, height: De }
        } = Oe(
          Q,
          { ...C, rotateAngle: C.rotateAngle },
          Xe,
          Ye,
          ae,
          Z,
          ke
        ), Te = je({
          centerX: ce,
          centerY: ue,
          width: ze,
          height: De,
          angle: s.value.angle
        });
        let _ = {
          ...s.value,
          ...Je(Te, ce, ue)
        };
        e.maxWidth > 0 && (_.width = Math.min(_.width, e.maxWidth)), e.maxHeight > 0 && (_.height = Math.min(_.height, e.maxHeight)), e.boundary && (_ = E(_, se, ae)), s.value = _, i("resize", s.value);
      }, () => {
        e.checkCollision && w() && (s.value = { ...s.value, width: Y, height: A, left: D, top: z }), i("resize-end", s.value);
      });
    }
    function E(a, y, p) {
      const [M, b, X, Y, A, D] = y;
      return a.left < M && (a.left = M, a.width = s.value.width, p && (a.height = s.value.height)), a.left + a.width > A && (a.left = s.value.left, a.width = A - a.left, p && (a.height = s.value.height)), a.top < X && (a.top = X, a.height = s.value.height, p && (a.width = s.value.width)), a.top + a.height > D && (a.top = s.value.top, a.height = D - a.top, p && (a.width = s.value.width)), a;
    }
    return watch(
      () => [e.width, e.height, e.left, e.top, e.angle],
      ([a, y, p, M, b], [X, Y, A, D, z]) => {
        a !== X && (s.value.width = a), y !== Y && (s.value.height = y), p !== A && (s.value.left = p), M !== D && (s.value.top = M), b !== z && (s.value.angle = b);
      }
    ), watch(
      () => s.value,
      (a) => {
        t("change", { ...a });
      },
      { deep: true }
    ), watch(
      () => e.selected,
      (a) => {
        d.value = a;
      },
      { immediate: true }
    ), (a, y) => (openBlock(), createBlock(resolveDynamicComponent(a.tag), {
      ref: r,
      class: normalizeClass([
        "es-drager",
        { disabled: a.disabled, dragging: unref(c), selected: unref(d), border: a.border }
      ]),
      style: normalizeStyle(u.value),
      onClick: y[3] || (y[3] = withModifiers(() => {
      }, ["stop"]))
    }, {
      default: withCtx(() => [
        renderSlot(a.$slots, "default"),
        x.value ? (openBlock(true), createElementBlock(Fragment, { key: 0 }, renderList(l.value, (p, M) => (openBlock(), createElementBlock("div", {
          key: M,
          class: "es-drager-dot",
          "data-side": p.side,
          style: normalizeStyle({ ...p }),
          onMousedown: (b) => m(p, b),
          onTouchstartPassive: (b) => m(p, b)
        }, [
          renderSlot(a.$slots, "resize", normalizeProps(guardReactiveProps({ side: p.side })), () => [
            st
          ])
        ], 44, ot))), 128)) : createCommentVNode("", true),
        v.value ? (openBlock(), createBlock(nt, {
          key: 1,
          modelValue: unref(s).angle,
          "onUpdate:modelValue": y[0] || (y[0] = (p) => unref(s).angle = p),
          element: h.value,
          onRotate: y[1] || (y[1] = (p) => i("rotate", unref(s))),
          onRotateStart: y[2] || (y[2] = (p) => i("rotate-start", unref(s))),
          onRotateEnd: f
        }, {
          default: withCtx(() => [
            renderSlot(a.$slots, "rotate")
          ]),
          _: 3
        }, 8, ["modelValue", "element"])) : createCommentVNode("", true)
      ]),
      _: 3
    }, 8, ["class", "style"]));
  }
});
var it = (o) => {
  o.component("es-drager", be);
};
be.install = it;
export {
  $e as DragerProps,
  be as ESDrager,
  be as default,
  it as install
};
//# sourceMappingURL=es-drager.js.map
