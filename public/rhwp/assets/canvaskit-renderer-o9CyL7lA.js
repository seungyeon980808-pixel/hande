import { a as localFontFaceKey, c as bytesToHex, i as loadLocalFontBytesFor, l as __commonJSMin, n as CANVASKIT_REPLAY_PLANES, o as resolveLocalFont, r as layerPaintOpReplayPlane, s as blake3, t as DEFAULT_CANVASKIT_SURFACE_REQUEST, u as __toESM } from "./index-BUkWz5UI.js";
//#region __vite-browser-external
var require___vite_browser_external = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {};
}));
//#endregion
//#region node_modules/canvaskit-wasm/bin/canvaskit.wasm?url
var import_canvaskit = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var CanvasKitInit = (() => {
		var _scriptName = typeof document != "undefined" ? document.currentScript?.src : void 0;
		if (typeof __filename != "undefined") _scriptName = _scriptName || __filename;
		return (async function(moduleArg = {}) {
			var moduleRtn;
			var u = moduleArg, da, ha, ka = new Promise((a, b) => {
				da = a;
				ha = b;
			}), na = "object" == typeof window, oa = "undefined" != typeof WorkerGlobalScope, pa = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node && "renderer" != process.type;
			(function(a) {
				a.Pd = a.Pd || [];
				a.Pd.push(function() {
					a.MakeSWCanvasSurface = function(b) {
						var d = b, f = "undefined" !== typeof OffscreenCanvas && d instanceof OffscreenCanvas;
						if (!("undefined" !== typeof HTMLCanvasElement && d instanceof HTMLCanvasElement || f || (d = document.getElementById(b), d))) throw "Canvas with id " + b + " was not found";
						if (b = a.MakeSurface(d.width, d.height)) b.Hd = d;
						return b;
					};
					a.MakeCanvasSurface || (a.MakeCanvasSurface = a.MakeSWCanvasSurface);
					a.MakeSurface = function(b, d) {
						var f = {
							width: b,
							height: d,
							colorType: a.ColorType.RGBA_8888,
							alphaType: a.AlphaType.Unpremul,
							colorSpace: a.ColorSpace.SRGB
						}, h = b * d * 4, n = a._malloc(h);
						if (f = a.Surface._makeRasterDirect(f, n, 4 * b)) f.Hd = null, f.tf = b, f.pf = d, f.rf = h, f.Te = n, f.getCanvas().clear(a.TRANSPARENT);
						return f;
					};
					a.MakeRasterDirectSurface = function(b, d, f) {
						return a.Surface._makeRasterDirect(b, d.byteOffset, f);
					};
					a.Surface.prototype.flush = function(b) {
						a.Id(this.Gd);
						this._flush();
						if (this.Hd) {
							var d = new Uint8ClampedArray(a.HEAPU8.buffer, this.Te, this.rf);
							d = new ImageData(d, this.tf, this.pf);
							b ? this.Hd.getContext("2d").putImageData(d, 0, 0, b[0], b[1], b[2] - b[0], b[3] - b[1]) : this.Hd.getContext("2d").putImageData(d, 0, 0);
						}
					};
					a.Surface.prototype.dispose = function() {
						this.Te && a._free(this.Te);
						this.delete();
					};
					a.Id = a.Id || function() {};
					a.Ne = a.Ne || function() {
						return null;
					};
				});
			})(u);
			(function(a) {
				a.Pd = a.Pd || [];
				a.Pd.push(function() {
					function b(m, q, w) {
						return m && m.hasOwnProperty(q) ? m[q] : w;
					}
					function d(m) {
						var q = qa(ra);
						ra[q] = m;
						return q;
					}
					function f(m) {
						return m.naturalHeight || m.videoHeight || m.displayHeight || m.height;
					}
					function h(m) {
						return m.naturalWidth || m.videoWidth || m.displayWidth || m.width;
					}
					function n(m, q, w, D) {
						m.bindTexture(m.TEXTURE_2D, q);
						D || w.alphaType !== a.AlphaType.Premul || m.pixelStorei(m.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0);
						return q;
					}
					function v(m, q, w) {
						w || q.alphaType !== a.AlphaType.Premul || m.pixelStorei(m.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1);
						m.bindTexture(m.TEXTURE_2D, null);
					}
					a.GetWebGLContext = function(m, q) {
						if (!m) throw "null canvas passed into makeWebGLContext";
						var w = {
							alpha: b(q, "alpha", 1),
							depth: b(q, "depth", 1),
							stencil: b(q, "stencil", 8),
							antialias: b(q, "antialias", 0),
							premultipliedAlpha: b(q, "premultipliedAlpha", 1),
							preserveDrawingBuffer: b(q, "preserveDrawingBuffer", 0),
							preferLowPowerToHighPerformance: b(q, "preferLowPowerToHighPerformance", 0),
							failIfMajorPerformanceCaveat: b(q, "failIfMajorPerformanceCaveat", 0),
							enableExtensionsByDefault: b(q, "enableExtensionsByDefault", 1),
							explicitSwapControl: b(q, "explicitSwapControl", 0),
							renderViaOffscreenBackBuffer: b(q, "renderViaOffscreenBackBuffer", 0)
						};
						w.majorVersion = q && q.majorVersion ? q.majorVersion : "undefined" !== typeof WebGL2RenderingContext ? 2 : 1;
						if (w.explicitSwapControl) throw "explicitSwapControl is not supported";
						m = sa(m, w);
						if (!m) return 0;
						ta(m);
						I.ce.getExtension("WEBGL_debug_renderer_info");
						return m;
					};
					a.deleteContext = function(m) {
						I === za[m] && (I = null);
						"object" == typeof JSEvents && JSEvents.bg(za[m].ce.canvas);
						za[m]?.ce.canvas && (za[m].ce.canvas.mf = void 0);
						za[m] = null;
					};
					a._setTextureCleanup({ deleteTexture: function(m, q) {
						var w = ra[q];
						w && za[m].ce.deleteTexture(w);
						ra[q] = null;
					} });
					a.MakeWebGLContext = function(m) {
						if (!this.Id(m)) return null;
						var q = this._MakeGrContext();
						if (!q) return null;
						q.Gd = m;
						var w = q.delete.bind(q);
						q["delete"] = function() {
							a.Id(this.Gd);
							w();
						}.bind(q);
						return I.Xe = q;
					};
					a.MakeGrContext = a.MakeWebGLContext;
					a.GrDirectContext.prototype.getResourceCacheLimitBytes = function() {
						a.Id(this.Gd);
						this._getResourceCacheLimitBytes();
					};
					a.GrDirectContext.prototype.getResourceCacheUsageBytes = function() {
						a.Id(this.Gd);
						this._getResourceCacheUsageBytes();
					};
					a.GrDirectContext.prototype.releaseResourcesAndAbandonContext = function() {
						a.Id(this.Gd);
						this._releaseResourcesAndAbandonContext();
					};
					a.GrDirectContext.prototype.setResourceCacheLimitBytes = function(m) {
						a.Id(this.Gd);
						this._setResourceCacheLimitBytes(m);
					};
					a.MakeOnScreenGLSurface = function(m, q, w, D, G, K) {
						if (!this.Id(m.Gd)) return null;
						q = void 0 === G || void 0 === K ? this._MakeOnScreenGLSurface(m, q, w, D) : this._MakeOnScreenGLSurface(m, q, w, D, G, K);
						if (!q) return null;
						q.Gd = m.Gd;
						return q;
					};
					a.MakeRenderTarget = function() {
						var m = arguments[0];
						if (!this.Id(m.Gd)) return null;
						if (3 === arguments.length) {
							var q = this._MakeRenderTargetWH(m, arguments[1], arguments[2]);
							if (!q) return null;
						} else if (2 === arguments.length) {
							if (q = this._MakeRenderTargetII(m, arguments[1]), !q) return null;
						} else return null;
						q.Gd = m.Gd;
						return q;
					};
					a.MakeWebGLCanvasSurface = function(m, q, w) {
						q = q || null;
						var D = m, G = "undefined" !== typeof OffscreenCanvas && D instanceof OffscreenCanvas;
						if (!("undefined" !== typeof HTMLCanvasElement && D instanceof HTMLCanvasElement || G || (D = document.getElementById(m), D))) throw "Canvas with id " + m + " was not found";
						m = this.GetWebGLContext(D, w);
						if (!m || 0 > m) throw "failed to create webgl context: err " + m;
						m = this.MakeWebGLContext(m);
						q = this.MakeOnScreenGLSurface(m, D.width, D.height, q);
						return q ? q : (q = D.cloneNode(!0), D.parentNode.replaceChild(q, D), q.classList.add("ck-replaced"), a.MakeSWCanvasSurface(q));
					};
					a.MakeCanvasSurface = a.MakeWebGLCanvasSurface;
					a.Surface.prototype.makeImageFromTexture = function(m, q) {
						a.Id(this.Gd);
						m = d(m);
						if (q = this._makeImageFromTexture(this.Gd, m, q)) q.Ee = m;
						return q;
					};
					a.Surface.prototype.makeImageFromTextureSource = function(m, q, w) {
						q ||= {
							height: f(m),
							width: h(m),
							colorType: a.ColorType.RGBA_8888,
							alphaType: w ? a.AlphaType.Premul : a.AlphaType.Unpremul
						};
						q.colorSpace || (q.colorSpace = a.ColorSpace.SRGB);
						a.Id(this.Gd);
						var D = I.ce;
						w = n(D, D.createTexture(), q, w);
						2 === I.version ? D.texImage2D(D.TEXTURE_2D, 0, D.RGBA, q.width, q.height, 0, D.RGBA, D.UNSIGNED_BYTE, m) : D.texImage2D(D.TEXTURE_2D, 0, D.RGBA, D.RGBA, D.UNSIGNED_BYTE, m);
						v(D, q);
						this._resetContext();
						return this.makeImageFromTexture(w, q);
					};
					a.Surface.prototype.updateTextureFromSource = function(m, q, w) {
						if (m.Ee) {
							a.Id(this.Gd);
							var D = m.getImageInfo(), G = I.ce, K = n(G, ra[m.Ee], D, w);
							2 === I.version ? G.texImage2D(G.TEXTURE_2D, 0, G.RGBA, h(q), f(q), 0, G.RGBA, G.UNSIGNED_BYTE, q) : G.texImage2D(G.TEXTURE_2D, 0, G.RGBA, G.RGBA, G.UNSIGNED_BYTE, q);
							v(G, D, w);
							this._resetContext();
							ra[m.Ee] = null;
							m.Ee = d(K);
							D.colorSpace = m.getColorSpace();
							q = this._makeImageFromTexture(this.Gd, m.Ee, D);
							w = m.Fd.Md;
							G = m.Fd.Rd;
							m.Fd.Md = q.Fd.Md;
							m.Fd.Rd = q.Fd.Rd;
							q.Fd.Md = w;
							q.Fd.Rd = G;
							q.delete();
							D.colorSpace.delete();
						}
					};
					a.MakeLazyImageFromTextureSource = function(m, q, w) {
						q ||= {
							height: f(m),
							width: h(m),
							colorType: a.ColorType.RGBA_8888,
							alphaType: w ? a.AlphaType.Premul : a.AlphaType.Unpremul
						};
						q.colorSpace || (q.colorSpace = a.ColorSpace.SRGB);
						var D = {
							makeTexture: function() {
								var G = I, K = G.ce, Y = n(K, K.createTexture(), q, w);
								2 === G.version ? K.texImage2D(K.TEXTURE_2D, 0, K.RGBA, q.width, q.height, 0, K.RGBA, K.UNSIGNED_BYTE, m) : K.texImage2D(K.TEXTURE_2D, 0, K.RGBA, K.RGBA, K.UNSIGNED_BYTE, m);
								v(K, q, w);
								return d(Y);
							},
							freeSrc: function() {}
						};
						"VideoFrame" === m.constructor.name && (D.freeSrc = function() {
							m.close();
						});
						return a.Image._makeFromGenerator(q, D);
					};
					a.Id = function(m) {
						return m ? ta(m) : !1;
					};
					a.Ne = function() {
						return I && I.Xe && !I.Xe.isDeleted() ? I.Xe : null;
					};
				});
			})(u);
			(function(a) {
				function b(e, c, g, l, t) {
					for (var x = 0; x < e.length; x++) c[x * g + (x * t + l + g) % g] = e[x];
					return c;
				}
				function d(e) {
					for (var c = e * e, g = Array(c); c--;) g[c] = 0 === c % (e + 1) ? 1 : 0;
					return g;
				}
				function f(e) {
					return e ? e.constructor === Float32Array && 4 === e.length : !1;
				}
				function h(e) {
					return (m(255 * e[3]) << 24 | m(255 * e[0]) << 16 | m(255 * e[1]) << 8 | m(255 * e[2]) << 0) >>> 0;
				}
				function n(e) {
					if (e && e._ck) return e;
					if (e instanceof Float32Array) {
						for (var c = Math.floor(e.length / 4), g = new Uint32Array(c), l = 0; l < c; l++) g[l] = h(e.slice(4 * l, 4 * (l + 1)));
						return g;
					}
					if (e instanceof Uint32Array) return e;
					if (e instanceof Array && e[0] instanceof Float32Array) return e.map(h);
				}
				function v(e) {
					if (void 0 === e) return 1;
					var c = parseFloat(e);
					return e && -1 !== e.indexOf("%") ? c / 100 : c;
				}
				function m(e) {
					return Math.round(Math.max(0, Math.min(e || 0, 255)));
				}
				function q(e, c) {
					c && c._ck || a._free(e);
				}
				function w(e, c, g) {
					if (!e || !e.length) return Q;
					if (e && e._ck) return e.byteOffset;
					var l = a[c].BYTES_PER_ELEMENT;
					g ||= a._malloc(e.length * l);
					a[c].set(e, g / l);
					return g;
				}
				function D(e) {
					var c = {
						Zd: Q,
						count: e.length,
						colorType: a.ColorType.RGBA_F32
					};
					if (e instanceof Float32Array) c.Zd = w(e, "HEAPF32"), c.count = e.length / 4;
					else if (e instanceof Uint32Array) c.Zd = w(e, "HEAPU32"), c.colorType = a.ColorType.RGBA_8888;
					else if (e instanceof Array) {
						if (e && e.length) {
							for (var g = a._malloc(16 * e.length), l = 0, t = g / 4, x = 0; x < e.length; x++) for (var A = 0; 4 > A; A++) a.HEAPF32[t + l] = e[x][A], l++;
							e = g;
						} else e = Q;
						c.Zd = e;
					} else throw "Invalid argument to copyFlexibleColorArray, Not a color array " + typeof e;
					return c;
				}
				function G(e) {
					if (!e) return Q;
					var c = Mb.toTypedArray();
					if (e.length) {
						if (6 === e.length || 9 === e.length) return w(e, "HEAPF32", xa), 6 === e.length && a.HEAPF32.set(jd, 6 + xa / 4), xa;
						if (16 === e.length) return c[0] = e[0], c[1] = e[1], c[2] = e[3], c[3] = e[4], c[4] = e[5], c[5] = e[7], c[6] = e[12], c[7] = e[13], c[8] = e[15], xa;
						throw "invalid matrix size";
					}
					if (void 0 === e.m11) throw "invalid matrix argument";
					c[0] = e.m11;
					c[1] = e.m21;
					c[2] = e.m41;
					c[3] = e.m12;
					c[4] = e.m22;
					c[5] = e.m42;
					c[6] = e.m14;
					c[7] = e.m24;
					c[8] = e.m44;
					return xa;
				}
				function K(e) {
					if (!e) return Q;
					var c = Nb.toTypedArray();
					if (e.length) {
						if (16 !== e.length && 6 !== e.length && 9 !== e.length) throw "invalid matrix size";
						if (16 === e.length) return w(e, "HEAPF32", Za);
						c.fill(0);
						c[0] = e[0];
						c[1] = e[1];
						c[3] = e[2];
						c[4] = e[3];
						c[5] = e[4];
						c[7] = e[5];
						c[10] = 1;
						c[12] = e[6];
						c[13] = e[7];
						c[15] = e[8];
						6 === e.length && (c[12] = 0, c[13] = 0, c[15] = 1);
						return Za;
					}
					if (void 0 === e.m11) throw "invalid matrix argument";
					c[0] = e.m11;
					c[1] = e.m21;
					c[2] = e.m31;
					c[3] = e.m41;
					c[4] = e.m12;
					c[5] = e.m22;
					c[6] = e.m32;
					c[7] = e.m42;
					c[8] = e.m13;
					c[9] = e.m23;
					c[10] = e.m33;
					c[11] = e.m43;
					c[12] = e.m14;
					c[13] = e.m24;
					c[14] = e.m34;
					c[15] = e.m44;
					return Za;
				}
				function Y(e, c) {
					return w(e, "HEAPF32", c || Qa);
				}
				function ea(e, c, g, l) {
					var t = Ob.toTypedArray();
					t[0] = e;
					t[1] = c;
					t[2] = g;
					t[3] = l;
					return Qa;
				}
				function fa(e) {
					for (var c = /* @__PURE__ */ new Float32Array(4), g = 0; 4 > g; g++) c[g] = a.HEAPF32[e / 4 + g];
					return c;
				}
				function S(e, c) {
					return w(e, "HEAPF32", c || ia);
				}
				function ya(e, c) {
					return w(e, "HEAPF32", c || Pb);
				}
				function ma() {
					for (var e = 0, c = 0; c < arguments.length - 1; c += 2) e += arguments[c] * arguments[c + 1];
					return e;
				}
				function Ma(e, c, g) {
					for (var l = Array(e.length), t = 0; t < g; t++) for (var x = 0; x < g; x++) {
						for (var A = 0, H = 0; H < g; H++) A += e[g * t + H] * c[g * H + x];
						l[t * g + x] = A;
					}
					return l;
				}
				function $a(e, c) {
					for (var g = Ma(c[0], c[1], e), l = 2; l < c.length;) g = Ma(g, c[l], e), l++;
					return g;
				}
				a.Color = function(e, c, g, l) {
					void 0 === l && (l = 1);
					return a.Color4f(m(e) / 255, m(c) / 255, m(g) / 255, l);
				};
				a.ColorAsInt = function(e, c, g, l) {
					void 0 === l && (l = 255);
					return (m(l) << 24 | m(e) << 16 | m(c) << 8 | m(g) << 0 & 268435455) >>> 0;
				};
				a.Color4f = function(e, c, g, l) {
					void 0 === l && (l = 1);
					return Float32Array.of(e, c, g, l);
				};
				Object.defineProperty(a, "TRANSPARENT", { get: function() {
					return a.Color4f(0, 0, 0, 0);
				} });
				Object.defineProperty(a, "BLACK", { get: function() {
					return a.Color4f(0, 0, 0, 1);
				} });
				Object.defineProperty(a, "WHITE", { get: function() {
					return a.Color4f(1, 1, 1, 1);
				} });
				Object.defineProperty(a, "RED", { get: function() {
					return a.Color4f(1, 0, 0, 1);
				} });
				Object.defineProperty(a, "GREEN", { get: function() {
					return a.Color4f(0, 1, 0, 1);
				} });
				Object.defineProperty(a, "BLUE", { get: function() {
					return a.Color4f(0, 0, 1, 1);
				} });
				Object.defineProperty(a, "YELLOW", { get: function() {
					return a.Color4f(1, 1, 0, 1);
				} });
				Object.defineProperty(a, "CYAN", { get: function() {
					return a.Color4f(0, 1, 1, 1);
				} });
				Object.defineProperty(a, "MAGENTA", { get: function() {
					return a.Color4f(1, 0, 1, 1);
				} });
				a.getColorComponents = function(e) {
					return [
						Math.floor(255 * e[0]),
						Math.floor(255 * e[1]),
						Math.floor(255 * e[2]),
						e[3]
					];
				};
				a.parseColorString = function(e, c) {
					e = e.toLowerCase();
					if (e.startsWith("#")) {
						c = 255;
						switch (e.length) {
							case 9: c = parseInt(e.slice(7, 9), 16);
							case 7:
								var g = parseInt(e.slice(1, 3), 16);
								var l = parseInt(e.slice(3, 5), 16);
								var t = parseInt(e.slice(5, 7), 16);
								break;
							case 5: c = 17 * parseInt(e.slice(4, 5), 16);
							case 4: g = 17 * parseInt(e.slice(1, 2), 16), l = 17 * parseInt(e.slice(2, 3), 16), t = 17 * parseInt(e.slice(3, 4), 16);
						}
						return a.Color(g, l, t, c / 255);
					}
					return e.startsWith("rgba") ? (e = e.slice(5, -1), e = e.split(","), a.Color(+e[0], +e[1], +e[2], v(e[3]))) : e.startsWith("rgb") ? (e = e.slice(4, -1), e = e.split(","), a.Color(+e[0], +e[1], +e[2], v(e[3]))) : e.startsWith("gray(") || e.startsWith("hsl") || !c || (e = c[e], void 0 === e) ? a.BLACK : e;
				};
				a.multiplyByAlpha = function(e, c) {
					e = e.slice();
					e[3] = Math.max(0, Math.min(e[3] * c, 1));
					return e;
				};
				a.Malloc = function(e, c) {
					var g = a._malloc(c * e.BYTES_PER_ELEMENT);
					return {
						_ck: !0,
						length: c,
						byteOffset: g,
						me: null,
						subarray: function(l, t) {
							l = this.toTypedArray().subarray(l, t);
							l._ck = !0;
							return l;
						},
						toTypedArray: function() {
							if (this.me && this.me.length) return this.me;
							this.me = new e(a.HEAPU8.buffer, g, c);
							this.me._ck = !0;
							return this.me;
						}
					};
				};
				a.Free = function(e) {
					a._free(e.byteOffset);
					e.byteOffset = Q;
					e.toTypedArray = null;
					e.me = null;
				};
				var xa = Q, Mb, Za = Q, Nb, Qa = Q, Ob, ua, ia = Q, nc, Na = Q, oc, Qb = Q, pc, Rb = Q, ob, db = Q, qc, Pb = Q, rc, sc = Q, jd = Float32Array.of(0, 0, 1), Q = 0;
				a.onRuntimeInitialized = function() {
					function e(c, g, l, t, x, A, H) {
						A || (A = 4 * t.width, t.colorType === a.ColorType.RGBA_F16 ? A *= 2 : t.colorType === a.ColorType.RGBA_F32 && (A *= 4));
						var L = A * t.height;
						var M = x ? x.byteOffset : a._malloc(L);
						if (H ? !c._readPixels(t, M, A, g, l, H) : !c._readPixels(t, M, A, g, l)) return x || a._free(M), null;
						if (x) return x.toTypedArray();
						switch (t.colorType) {
							case a.ColorType.RGBA_8888:
							case a.ColorType.RGBA_F16:
								c = new Uint8Array(a.HEAPU8.buffer, M, L).slice();
								break;
							case a.ColorType.RGBA_F32:
								c = new Float32Array(a.HEAPU8.buffer, M, L).slice();
								break;
							default: return null;
						}
						a._free(M);
						return c;
					}
					Ob = a.Malloc(Float32Array, 4);
					Qa = Ob.byteOffset;
					Nb = a.Malloc(Float32Array, 16);
					Za = Nb.byteOffset;
					Mb = a.Malloc(Float32Array, 9);
					xa = Mb.byteOffset;
					qc = a.Malloc(Float32Array, 12);
					Pb = qc.byteOffset;
					rc = a.Malloc(Float32Array, 12);
					sc = rc.byteOffset;
					ua = a.Malloc(Float32Array, 4);
					ia = ua.byteOffset;
					nc = a.Malloc(Float32Array, 4);
					Na = nc.byteOffset;
					oc = a.Malloc(Float32Array, 3);
					Qb = oc.byteOffset;
					pc = a.Malloc(Float32Array, 3);
					Rb = pc.byteOffset;
					ob = a.Malloc(Int32Array, 4);
					db = ob.byteOffset;
					a.ColorSpace.SRGB = a.ColorSpace._MakeSRGB();
					a.ColorSpace.DISPLAY_P3 = a.ColorSpace._MakeDisplayP3();
					a.ColorSpace.ADOBE_RGB = a.ColorSpace._MakeAdobeRGB();
					a.GlyphRunFlags = { IsWhiteSpace: a._GlyphRunFlags_isWhiteSpace };
					a.Path.MakeFromCmds = function(c) {
						var g = w(c, "HEAPF32"), l = a.Path._MakeFromCmds(g, c.length);
						q(g, c);
						return l;
					};
					a.Path.MakeFromVerbsPointsWeights = function(c, g, l) {
						var t = w(c, "HEAPU8"), x = w(g, "HEAPF32"), A = w(l, "HEAPF32"), H = a.Path._MakeFromVerbsPointsWeights(t, c.length, x, g.length / 2, A, l && l.length || 0);
						q(t, c);
						q(x, g);
						q(A, l);
						return H;
					};
					a.PathBuilder.prototype.addArc = function(c, g, l) {
						c = S(c);
						this._addArc(c, g, l);
						return this;
					};
					a.PathBuilder.prototype.addCircle = function(c, g, l, t) {
						this._addCircle(c, g, l, !!t);
						return this;
					};
					a.PathBuilder.prototype.addOval = function(c, g, l) {
						void 0 === l && (l = 1);
						c = S(c);
						this._addOval(c, !!g, l);
						return this;
					};
					a.PathBuilder.prototype.addPath = function() {
						var c = Array.prototype.slice.call(arguments), g = c[0], l = !1;
						"boolean" === typeof c[c.length - 1] && (l = c.pop());
						if (1 === c.length) this._addPath(g, 1, 0, 0, 0, 1, 0, 0, 0, 1, l);
						else if (2 === c.length) c = c[1], this._addPath(g, c[0], c[1], c[2], c[3], c[4], c[5], c[6] || 0, c[7] || 0, c[8] || 1, l);
						else if (7 === c.length || 10 === c.length) this._addPath(g, c[1], c[2], c[3], c[4], c[5], c[6], c[7] || 0, c[8] || 0, c[9] || 1, l);
						else return null;
						return this;
					};
					a.PathBuilder.prototype.addPolygon = function(c, g) {
						var l = w(c, "HEAPF32");
						this._addPolygon(l, c.length / 2, g);
						q(l, c);
						return this;
					};
					a.PathBuilder.prototype.addRect = function(c, g) {
						c = S(c);
						this._addRect(c, !!g);
						return this;
					};
					a.PathBuilder.prototype.addRRect = function(c, g) {
						c = ya(c);
						this._addRRect(c, !!g);
						return this;
					};
					a.PathBuilder.prototype.addVerbsPointsWeights = function(c, g, l) {
						var t = w(c, "HEAPU8"), x = w(g, "HEAPF32"), A = w(l, "HEAPF32");
						this._addVerbsPointsWeights(t, c.length, x, g.length / 2, A, l && l.length || 0);
						q(t, c);
						q(x, g);
						q(A, l);
						return this;
					};
					a.PathBuilder.prototype.arc = function(c, g, l, t, x, A) {
						c = a.LTRBRect(c - l, g - l, c + l, g + l);
						x = (x - t) / Math.PI * 180 - 360 * !!A;
						t = new a.PathBuilder().addArc(c, t / Math.PI * 180, x).detachAndDelete();
						this.addPath(t, !0);
						t.delete();
						return this;
					};
					a.PathBuilder.prototype.arcToOval = function(c, g, l, t) {
						c = S(c);
						this._arcToOval(c, g, l, t);
						return this;
					};
					a.PathBuilder.prototype.arcToRotated = function(c, g, l, t, x, A, H) {
						this._arcToRotated(c, g, l, !!t, !!x, A, H);
						return this;
					};
					a.PathBuilder.prototype.arcToTangent = function(c, g, l, t, x) {
						this._arcToTangent(c, g, l, t, x);
						return this;
					};
					a.PathBuilder.prototype.close = function() {
						this._close();
						return this;
					};
					a.PathBuilder.prototype.conicTo = function(c, g, l, t, x) {
						this._conicTo(c, g, l, t, x);
						return this;
					};
					a.Path.prototype.computeTightBounds = function(c) {
						this._computeTightBounds(ia);
						var g = ua.toTypedArray();
						return c ? (c.set(g), c) : g.slice();
					};
					a.PathBuilder.prototype.cubicTo = function(c, g, l, t, x, A) {
						this._cubicTo(c, g, l, t, x, A);
						return this;
					};
					a.PathBuilder.prototype.detachAndDelete = function() {
						var c = this.detach();
						this.delete();
						return c;
					};
					a.Path.prototype.getBounds = function(c) {
						this._getBounds(ia);
						var g = ua.toTypedArray();
						return c ? (c.set(g), c) : g.slice();
					};
					a.PathBuilder.prototype.getBounds = function(c) {
						this._getBounds(ia);
						var g = ua.toTypedArray();
						return c ? (c.set(g), c) : g.slice();
					};
					a.PathBuilder.prototype.lineTo = function(c, g) {
						this._lineTo(c, g);
						return this;
					};
					a.PathBuilder.prototype.moveTo = function(c, g) {
						this._moveTo(c, g);
						return this;
					};
					a.PathBuilder.prototype.offset = function(c, g) {
						this._transform(1, 0, c, 0, 1, g, 0, 0, 1);
						return this;
					};
					a.PathBuilder.prototype.quadTo = function(c, g, l, t) {
						this._quadTo(c, g, l, t);
						return this;
					};
					a.PathBuilder.prototype.rArcTo = function(c, g, l, t, x, A, H) {
						this._rArcTo(c, g, l, t, x, A, H);
						return this;
					};
					a.PathBuilder.prototype.rConicTo = function(c, g, l, t, x) {
						this._rConicTo(c, g, l, t, x);
						return this;
					};
					a.PathBuilder.prototype.rCubicTo = function(c, g, l, t, x, A) {
						this._rCubicTo(c, g, l, t, x, A);
						return this;
					};
					a.PathBuilder.prototype.rLineTo = function(c, g) {
						this._rLineTo(c, g);
						return this;
					};
					a.PathBuilder.prototype.rMoveTo = function(c, g) {
						this._rMoveTo(c, g);
						return this;
					};
					a.PathBuilder.prototype.rQuadTo = function(c, g, l, t) {
						this._rQuadTo(c, g, l, t);
						return this;
					};
					a.Path.prototype.makeStroked = function(c) {
						c = c || {};
						c.width = c.width || 1;
						c.miter_limit = c.miter_limit || 4;
						c.cap = c.cap || a.StrokeCap.Butt;
						c.join = c.join || a.StrokeJoin.Miter;
						c.precision = c.precision || 1;
						return this._makeStroked(c);
					};
					a.PathBuilder.prototype.transform = function() {
						if (1 === arguments.length) {
							var c = arguments[0];
							this._transform(c[0], c[1], c[2], c[3], c[4], c[5], c[6] || 0, c[7] || 0, c[8] || 1);
						} else if (6 === arguments.length || 9 === arguments.length) c = arguments, this._transform(c[0], c[1], c[2], c[3], c[4], c[5], c[6] || 0, c[7] || 0, c[8] || 1);
						else throw "transform expected to take 1 or 9 arguments. Got " + arguments.length;
						return this;
					};
					a.Path.prototype.makeTrimmed = function(c, g, l) {
						return this._makeTrimmed(c, g, !!l);
					};
					a.Image.prototype.encodeToBytes = function(c, g) {
						var l = a.Ne();
						c = c || a.ImageFormat.PNG;
						g = g || 100;
						return l ? this._encodeToBytes(c, g, l) : this._encodeToBytes(c, g);
					};
					a.Image.prototype.makeShaderCubic = function(c, g, l, t, x) {
						x = G(x);
						return this._makeShaderCubic(c, g, l, t, x);
					};
					a.Image.prototype.makeShaderOptions = function(c, g, l, t, x) {
						x = G(x);
						return this._makeShaderOptions(c, g, l, t, x);
					};
					a.Image.prototype.readPixels = function(c, g, l, t, x) {
						var A = a.Ne();
						return e(this, c, g, l, t, x, A);
					};
					a.Canvas.prototype.clear = function(c) {
						a.Id(this.Gd);
						c = Y(c);
						this._clear(c);
					};
					a.Canvas.prototype.clipRRect = function(c, g, l) {
						a.Id(this.Gd);
						c = ya(c);
						this._clipRRect(c, g, l);
					};
					a.Canvas.prototype.clipRect = function(c, g, l) {
						a.Id(this.Gd);
						c = S(c);
						this._clipRect(c, g, l);
					};
					a.Canvas.prototype.concat = function(c) {
						a.Id(this.Gd);
						c = K(c);
						this._concat(c);
					};
					a.Canvas.prototype.drawArc = function(c, g, l, t, x) {
						a.Id(this.Gd);
						c = S(c);
						this._drawArc(c, g, l, t, x);
					};
					a.Canvas.prototype.drawAtlas = function(c, g, l, t, x, A, H) {
						if (c && t && g && l && g.length === l.length) {
							a.Id(this.Gd);
							x || (x = a.BlendMode.SrcOver);
							var L = w(g, "HEAPF32"), M = w(l, "HEAPF32"), V = l.length / 4, X = w(n(A), "HEAPU32");
							if (H && "B" in H && "C" in H) this._drawAtlasCubic(c, M, L, X, V, x, H.B, H.C, t);
							else {
								let r = a.FilterMode.Linear, C = a.MipmapMode.None;
								H && (r = H.filter, "mipmap" in H && (C = H.mipmap));
								this._drawAtlasOptions(c, M, L, X, V, x, r, C, t);
							}
							q(L, g);
							q(M, l);
							q(X, A);
						}
					};
					a.Canvas.prototype.drawCircle = function(c, g, l, t) {
						a.Id(this.Gd);
						this._drawCircle(c, g, l, t);
					};
					a.Canvas.prototype.drawColor = function(c, g) {
						a.Id(this.Gd);
						c = Y(c);
						void 0 !== g ? this._drawColor(c, g) : this._drawColor(c);
					};
					a.Canvas.prototype.drawColorInt = function(c, g) {
						a.Id(this.Gd);
						this._drawColorInt(c, g || a.BlendMode.SrcOver);
					};
					a.Canvas.prototype.drawColorComponents = function(c, g, l, t, x) {
						a.Id(this.Gd);
						c = ea(c, g, l, t);
						void 0 !== x ? this._drawColor(c, x) : this._drawColor(c);
					};
					a.Canvas.prototype.drawDRRect = function(c, g, l) {
						a.Id(this.Gd);
						c = ya(c, Pb);
						g = ya(g, sc);
						this._drawDRRect(c, g, l);
					};
					a.Canvas.prototype.drawImage = function(c, g, l, t) {
						a.Id(this.Gd);
						this._drawImage(c, g, l, t || null);
					};
					a.Canvas.prototype.drawImageCubic = function(c, g, l, t, x, A) {
						a.Id(this.Gd);
						this._drawImageCubic(c, g, l, t, x, A || null);
					};
					a.Canvas.prototype.drawImageOptions = function(c, g, l, t, x, A) {
						a.Id(this.Gd);
						this._drawImageOptions(c, g, l, t, x, A || null);
					};
					a.Canvas.prototype.drawImageNine = function(c, g, l, t, x) {
						a.Id(this.Gd);
						g = w(g, "HEAP32", db);
						l = S(l);
						this._drawImageNine(c, g, l, t, x || null);
					};
					a.Canvas.prototype.drawImageRect = function(c, g, l, t, x) {
						a.Id(this.Gd);
						S(g, ia);
						S(l, Na);
						this._drawImageRect(c, ia, Na, t, !!x);
					};
					a.Canvas.prototype.drawImageRectCubic = function(c, g, l, t, x, A) {
						a.Id(this.Gd);
						S(g, ia);
						S(l, Na);
						this._drawImageRectCubic(c, ia, Na, t, x, A || null);
					};
					a.Canvas.prototype.drawImageRectOptions = function(c, g, l, t, x, A) {
						a.Id(this.Gd);
						S(g, ia);
						S(l, Na);
						this._drawImageRectOptions(c, ia, Na, t, x, A || null);
					};
					a.Canvas.prototype.drawLine = function(c, g, l, t, x) {
						a.Id(this.Gd);
						this._drawLine(c, g, l, t, x);
					};
					a.Canvas.prototype.drawOval = function(c, g) {
						a.Id(this.Gd);
						c = S(c);
						this._drawOval(c, g);
					};
					a.Canvas.prototype.drawPaint = function(c) {
						a.Id(this.Gd);
						this._drawPaint(c);
					};
					a.Canvas.prototype.drawParagraph = function(c, g, l) {
						a.Id(this.Gd);
						this._drawParagraph(c, g, l);
					};
					a.Canvas.prototype.drawPatch = function(c, g, l, t, x) {
						if (24 > c.length) throw "Need 12 cubic points";
						if (g && 4 > g.length) throw "Need 4 colors";
						if (l && 8 > l.length) throw "Need 4 shader coordinates";
						a.Id(this.Gd);
						const A = w(c, "HEAPF32"), H = g ? w(n(g), "HEAPU32") : Q, L = l ? w(l, "HEAPF32") : Q;
						t || (t = a.BlendMode.Modulate);
						this._drawPatch(A, H, L, t, x);
						q(L, l);
						q(H, g);
						q(A, c);
					};
					a.Canvas.prototype.drawPath = function(c, g) {
						a.Id(this.Gd);
						this._drawPath(c, g);
					};
					a.Canvas.prototype.drawPicture = function(c) {
						a.Id(this.Gd);
						this._drawPicture(c);
					};
					a.Canvas.prototype.drawPoints = function(c, g, l) {
						a.Id(this.Gd);
						var t = w(g, "HEAPF32");
						this._drawPoints(c, t, g.length / 2, l);
						q(t, g);
					};
					a.Canvas.prototype.drawRRect = function(c, g) {
						a.Id(this.Gd);
						c = ya(c);
						this._drawRRect(c, g);
					};
					a.Canvas.prototype.drawRect = function(c, g) {
						a.Id(this.Gd);
						c = S(c);
						this._drawRect(c, g);
					};
					a.Canvas.prototype.drawRect4f = function(c, g, l, t, x) {
						a.Id(this.Gd);
						this._drawRect4f(c, g, l, t, x);
					};
					a.Canvas.prototype.drawShadow = function(c, g, l, t, x, A, H) {
						a.Id(this.Gd);
						var L = w(x, "HEAPF32"), M = w(A, "HEAPF32");
						g = w(g, "HEAPF32", Qb);
						l = w(l, "HEAPF32", Rb);
						this._drawShadow(c, g, l, t, L, M, H);
						q(L, x);
						q(M, A);
					};
					a.getShadowLocalBounds = function(c, g, l, t, x, A, H) {
						c = G(c);
						l = w(l, "HEAPF32", Qb);
						t = w(t, "HEAPF32", Rb);
						if (!this._getShadowLocalBounds(c, g, l, t, x, A, ia)) return null;
						g = ua.toTypedArray();
						return H ? (H.set(g), H) : g.slice();
					};
					a.Canvas.prototype.drawTextBlob = function(c, g, l, t) {
						a.Id(this.Gd);
						this._drawTextBlob(c, g, l, t);
					};
					a.Canvas.prototype.drawVertices = function(c, g, l) {
						a.Id(this.Gd);
						this._drawVertices(c, g, l);
					};
					a.Canvas.prototype.getDeviceClipBounds = function(c) {
						this._getDeviceClipBounds(db);
						var g = ob.toTypedArray();
						c ? c.set(g) : c = g.slice();
						return c;
					};
					a.Canvas.prototype.quickReject = function(c) {
						c = S(c);
						return this._quickReject(c);
					};
					a.Canvas.prototype.getLocalToDevice = function() {
						this._getLocalToDevice(Za);
						for (var c = Za, g = Array(16), l = 0; 16 > l; l++) g[l] = a.HEAPF32[c / 4 + l];
						return g;
					};
					a.Canvas.prototype.getTotalMatrix = function() {
						this._getTotalMatrix(xa);
						for (var c = Array(9), g = 0; 9 > g; g++) c[g] = a.HEAPF32[xa / 4 + g];
						return c;
					};
					a.Canvas.prototype.makeSurface = function(c) {
						c = this._makeSurface(c);
						c.Gd = this.Gd;
						return c;
					};
					a.Canvas.prototype.readPixels = function(c, g, l, t, x) {
						a.Id(this.Gd);
						return e(this, c, g, l, t, x);
					};
					a.Canvas.prototype.saveLayer = function(c, g, l, t, x) {
						g = S(g);
						return this._saveLayer(c || null, g, l || null, t || 0, x || a.TileMode.Clamp);
					};
					a.Canvas.prototype.writePixels = function(c, g, l, t, x, A, H, L) {
						if (c.byteLength % (g * l)) throw "pixels length must be a multiple of the srcWidth * srcHeight";
						a.Id(this.Gd);
						var M = c.byteLength / (g * l);
						A = A || a.AlphaType.Unpremul;
						H = H || a.ColorType.RGBA_8888;
						L = L || a.ColorSpace.SRGB;
						var V = M * g;
						M = w(c, "HEAPU8");
						g = this._writePixels({
							width: g,
							height: l,
							colorType: H,
							alphaType: A,
							colorSpace: L
						}, M, V, t, x);
						q(M, c);
						return g;
					};
					a.ColorFilter.MakeBlend = function(c, g, l) {
						c = Y(c);
						l = l || a.ColorSpace.SRGB;
						return a.ColorFilter._MakeBlend(c, g, l);
					};
					a.ColorFilter.MakeMatrix = function(c) {
						if (!c || 20 !== c.length) throw "invalid color matrix";
						var g = w(c, "HEAPF32"), l = a.ColorFilter._makeMatrix(g);
						q(g, c);
						return l;
					};
					a.ContourMeasure.prototype.getPosTan = function(c, g) {
						this._getPosTan(c, ia);
						c = ua.toTypedArray();
						return g ? (g.set(c), g) : c.slice();
					};
					a.ImageFilter.prototype.getOutputBounds = function(c, g, l) {
						c = S(c, ia);
						g = G(g);
						this._getOutputBounds(c, g, db);
						g = ob.toTypedArray();
						return l ? (l.set(g), l) : g.slice();
					};
					a.ImageFilter.MakeDropShadow = function(c, g, l, t, x, A) {
						x = Y(x, Qa);
						return a.ImageFilter._MakeDropShadow(c, g, l, t, x, A);
					};
					a.ImageFilter.MakeDropShadowOnly = function(c, g, l, t, x, A) {
						x = Y(x, Qa);
						return a.ImageFilter._MakeDropShadowOnly(c, g, l, t, x, A);
					};
					a.ImageFilter.MakeImage = function(c, g, l, t) {
						l = S(l, ia);
						t = S(t, Na);
						if ("B" in g && "C" in g) return a.ImageFilter._MakeImageCubic(c, g.B, g.C, l, t);
						const x = g.filter;
						let A = a.MipmapMode.None;
						"mipmap" in g && (A = g.mipmap);
						return a.ImageFilter._MakeImageOptions(c, x, A, l, t);
					};
					a.ImageFilter.MakeMatrixTransform = function(c, g, l) {
						c = G(c);
						if ("B" in g && "C" in g) return a.ImageFilter._MakeMatrixTransformCubic(c, g.B, g.C, l);
						const t = g.filter;
						let x = a.MipmapMode.None;
						"mipmap" in g && (x = g.mipmap);
						return a.ImageFilter._MakeMatrixTransformOptions(c, t, x, l);
					};
					a.Paint.prototype.getColor = function() {
						this._getColor(Qa);
						return fa(Qa);
					};
					a.Paint.prototype.setColor = function(c, g) {
						g = g || null;
						c = Y(c);
						this._setColor(c, g);
					};
					a.Paint.prototype.setColorComponents = function(c, g, l, t, x) {
						x = x || null;
						c = ea(c, g, l, t);
						this._setColor(c, x);
					};
					a.Path.prototype.getPoint = function(c, g) {
						this._getPoint(c, ia);
						c = ua.toTypedArray();
						return g ? (g[0] = c[0], g[1] = c[1], g) : c.slice(0, 2);
					};
					a.Picture.prototype.makeShader = function(c, g, l, t, x) {
						t = G(t);
						x = S(x);
						return this._makeShader(c, g, l, t, x);
					};
					a.Picture.prototype.cullRect = function(c) {
						this._cullRect(ia);
						var g = ua.toTypedArray();
						return c ? (c.set(g), c) : g.slice();
					};
					a.PictureRecorder.prototype.beginRecording = function(c, g) {
						c = S(c);
						return this._beginRecording(c, !!g);
					};
					a.Surface.prototype.getCanvas = function() {
						var c = this._getCanvas();
						c.Gd = this.Gd;
						return c;
					};
					a.Surface.prototype.makeImageSnapshot = function(c) {
						a.Id(this.Gd);
						c = w(c, "HEAP32", db);
						return this._makeImageSnapshot(c);
					};
					a.Surface.prototype.makeSurface = function(c) {
						a.Id(this.Gd);
						c = this._makeSurface(c);
						c.Gd = this.Gd;
						return c;
					};
					a.Surface.prototype.sf = function(c, g) {
						this.Ae || (this.Ae = this.getCanvas());
						return requestAnimationFrame(function() {
							a.Id(this.Gd);
							c(this.Ae);
							this.flush(g);
						}.bind(this));
					};
					a.Surface.prototype.requestAnimationFrame || (a.Surface.prototype.requestAnimationFrame = a.Surface.prototype.sf);
					a.Surface.prototype.nf = function(c, g) {
						this.Ae || (this.Ae = this.getCanvas());
						requestAnimationFrame(function() {
							a.Id(this.Gd);
							c(this.Ae);
							this.flush(g);
							this.dispose();
						}.bind(this));
					};
					a.Surface.prototype.drawOnce || (a.Surface.prototype.drawOnce = a.Surface.prototype.nf);
					a.PathEffect.MakeDash = function(c, g) {
						g ||= 0;
						if (!c.length || 1 === c.length % 2) throw "Intervals array must have even length";
						var l = w(c, "HEAPF32");
						g = a.PathEffect._MakeDash(l, c.length, g);
						q(l, c);
						return g;
					};
					a.PathEffect.MakeLine2D = function(c, g) {
						g = G(g);
						return a.PathEffect._MakeLine2D(c, g);
					};
					a.PathEffect.MakePath2D = function(c, g) {
						c = G(c);
						return a.PathEffect._MakePath2D(c, g);
					};
					a.Shader.MakeColor = function(c, g) {
						g = g || null;
						c = Y(c);
						return a.Shader._MakeColor(c, g);
					};
					a.Shader.Blend = a.Shader.MakeBlend;
					a.Shader.Color = a.Shader.MakeColor;
					a.Shader.MakeLinearGradient = function(c, g, l, t, x, A, H, L) {
						L = L || null;
						var M = D(l), V = w(t, "HEAPF32");
						H = H || 0;
						A = G(A);
						var X = ua.toTypedArray();
						X.set(c);
						X.set(g, 2);
						c = a.Shader._MakeLinearGradient(ia, M.Zd, M.colorType, V, M.count, x, H, A, L);
						q(M.Zd, l);
						t && q(V, t);
						return c;
					};
					a.Shader.MakeRadialGradient = function(c, g, l, t, x, A, H, L) {
						L = L || null;
						var M = D(l), V = w(t, "HEAPF32");
						H = H || 0;
						A = G(A);
						c = a.Shader._MakeRadialGradient(c[0], c[1], g, M.Zd, M.colorType, V, M.count, x, H, A, L);
						q(M.Zd, l);
						t && q(V, t);
						return c;
					};
					a.Shader.MakeSweepGradient = function(c, g, l, t, x, A, H, L, M, V) {
						V = V || null;
						var X = D(l), r = w(t, "HEAPF32");
						H = H || 0;
						L = L || 0;
						M = M || 360;
						A = G(A);
						c = a.Shader._MakeSweepGradient(c, g, X.Zd, X.colorType, r, X.count, x, L, M, H, A, V);
						q(X.Zd, l);
						t && q(r, t);
						return c;
					};
					a.Shader.MakeTwoPointConicalGradient = function(c, g, l, t, x, A, H, L, M, V) {
						V = V || null;
						var X = D(x), r = w(A, "HEAPF32");
						M = M || 0;
						L = G(L);
						var C = ua.toTypedArray();
						C.set(c);
						C.set(l, 2);
						c = a.Shader._MakeTwoPointConicalGradient(ia, g, t, X.Zd, X.colorType, r, X.count, H, M, L, V);
						q(X.Zd, x);
						A && q(r, A);
						return c;
					};
					a.Vertices.prototype.bounds = function(c) {
						this._bounds(ia);
						var g = ua.toTypedArray();
						return c ? (c.set(g), c) : g.slice();
					};
					a.Pd && a.Pd.forEach(function(c) {
						c();
					});
				};
				a.computeTonalColors = function(e) {
					var c = w(e.ambient, "HEAPF32"), g = w(e.spot, "HEAPF32");
					this._computeTonalColors(c, g);
					var l = {
						ambient: fa(c),
						spot: fa(g)
					};
					q(c, e.ambient);
					q(g, e.spot);
					return l;
				};
				a.LTRBRect = function(e, c, g, l) {
					return Float32Array.of(e, c, g, l);
				};
				a.XYWHRect = function(e, c, g, l) {
					return Float32Array.of(e, c, e + g, c + l);
				};
				a.LTRBiRect = function(e, c, g, l) {
					return Int32Array.of(e, c, g, l);
				};
				a.XYWHiRect = function(e, c, g, l) {
					return Int32Array.of(e, c, e + g, c + l);
				};
				a.RRectXY = function(e, c, g) {
					return Float32Array.of(e[0], e[1], e[2], e[3], c, g, c, g, c, g, c, g);
				};
				a.MakeAnimatedImageFromEncoded = function(e) {
					e = new Uint8Array(e);
					var c = a._malloc(e.byteLength);
					a.HEAPU8.set(e, c);
					return (e = a._decodeAnimatedImage(c, e.byteLength)) ? e : null;
				};
				a.MakeImageFromEncoded = function(e) {
					e = new Uint8Array(e);
					var c = a._malloc(e.byteLength);
					a.HEAPU8.set(e, c);
					return (e = a._decodeImage(c, e.byteLength)) ? e : null;
				};
				var pb = null;
				a.MakeImageFromCanvasImageSource = function(e) {
					var c = e.width, g = e.height;
					pb ||= document.createElement("canvas");
					pb.width = c;
					pb.height = g;
					var l = pb.getContext("2d", { willReadFrequently: !0 });
					l.drawImage(e, 0, 0);
					e = l.getImageData(0, 0, c, g);
					return a.MakeImage({
						width: c,
						height: g,
						alphaType: a.AlphaType.Unpremul,
						colorType: a.ColorType.RGBA_8888,
						colorSpace: a.ColorSpace.SRGB
					}, e.data, 4 * c);
				};
				a.MakeImage = function(e, c, g) {
					var l = a._malloc(c.length);
					a.HEAPU8.set(c, l);
					return a._MakeImage(e, l, c.length, g);
				};
				a.MakeVertices = function(e, c, g, l, t, x) {
					var A = t && t.length || 0, H = 0;
					g && g.length && (H |= 1);
					l && l.length && (H |= 2);
					void 0 === x || x || (H |= 4);
					e = new a._VerticesBuilder(e, c.length / 2, A, H);
					w(c, "HEAPF32", e.positions());
					e.texCoords() && w(g, "HEAPF32", e.texCoords());
					e.colors() && w(n(l), "HEAPU32", e.colors());
					e.indices() && w(t, "HEAPU16", e.indices());
					return e.detach();
				};
				a.Matrix = {};
				a.Matrix.identity = function() {
					return d(3);
				};
				a.Matrix.invert = function(e) {
					var c = e[0] * e[4] * e[8] + e[1] * e[5] * e[6] + e[2] * e[3] * e[7] - e[2] * e[4] * e[6] - e[1] * e[3] * e[8] - e[0] * e[5] * e[7];
					return c ? [
						(e[4] * e[8] - e[5] * e[7]) / c,
						(e[2] * e[7] - e[1] * e[8]) / c,
						(e[1] * e[5] - e[2] * e[4]) / c,
						(e[5] * e[6] - e[3] * e[8]) / c,
						(e[0] * e[8] - e[2] * e[6]) / c,
						(e[2] * e[3] - e[0] * e[5]) / c,
						(e[3] * e[7] - e[4] * e[6]) / c,
						(e[1] * e[6] - e[0] * e[7]) / c,
						(e[0] * e[4] - e[1] * e[3]) / c
					] : null;
				};
				a.Matrix.mapPoints = function(e, c) {
					for (var g = 0; g < c.length; g += 2) {
						var l = c[g], t = c[g + 1], x = e[6] * l + e[7] * t + e[8], A = e[3] * l + e[4] * t + e[5];
						c[g] = (e[0] * l + e[1] * t + e[2]) / x;
						c[g + 1] = A / x;
					}
					return c;
				};
				a.Matrix.multiply = function() {
					return $a(3, arguments);
				};
				a.Matrix.rotated = function(e, c, g) {
					c = c || 0;
					g = g || 0;
					var l = Math.sin(e);
					e = Math.cos(e);
					return [
						e,
						-l,
						ma(l, g, 1 - e, c),
						l,
						e,
						ma(-l, c, 1 - e, g),
						0,
						0,
						1
					];
				};
				a.Matrix.scaled = function(e, c, g, l) {
					g = g || 0;
					l = l || 0;
					var t = b([e, c], d(3), 3, 0, 1);
					return b([g - e * g, l - c * l], t, 3, 2, 0);
				};
				a.Matrix.skewed = function(e, c, g, l) {
					g = g || 0;
					l = l || 0;
					var t = b([e, c], d(3), 3, 1, -1);
					return b([-e * g, -c * l], t, 3, 2, 0);
				};
				a.Matrix.translated = function(e, c) {
					return b(arguments, d(3), 3, 2, 0);
				};
				a.Vector = {};
				a.Vector.dot = function(e, c) {
					return e.map(function(g, l) {
						return g * c[l];
					}).reduce(function(g, l) {
						return g + l;
					});
				};
				a.Vector.lengthSquared = function(e) {
					return a.Vector.dot(e, e);
				};
				a.Vector.length = function(e) {
					return Math.sqrt(a.Vector.lengthSquared(e));
				};
				a.Vector.mulScalar = function(e, c) {
					return e.map(function(g) {
						return g * c;
					});
				};
				a.Vector.add = function(e, c) {
					return e.map(function(g, l) {
						return g + c[l];
					});
				};
				a.Vector.sub = function(e, c) {
					return e.map(function(g, l) {
						return g - c[l];
					});
				};
				a.Vector.dist = function(e, c) {
					return a.Vector.length(a.Vector.sub(e, c));
				};
				a.Vector.normalize = function(e) {
					return a.Vector.mulScalar(e, 1 / a.Vector.length(e));
				};
				a.Vector.cross = function(e, c) {
					return [
						e[1] * c[2] - e[2] * c[1],
						e[2] * c[0] - e[0] * c[2],
						e[0] * c[1] - e[1] * c[0]
					];
				};
				a.M44 = {};
				a.M44.identity = function() {
					return d(4);
				};
				a.M44.translated = function(e) {
					return b(e, d(4), 4, 3, 0);
				};
				a.M44.scaled = function(e) {
					return b(e, d(4), 4, 0, 1);
				};
				a.M44.rotated = function(e, c) {
					return a.M44.rotatedUnitSinCos(a.Vector.normalize(e), Math.sin(c), Math.cos(c));
				};
				a.M44.rotatedUnitSinCos = function(e, c, g) {
					var l = e[0], t = e[1];
					e = e[2];
					var x = 1 - g;
					return [
						x * l * l + g,
						x * l * t - c * e,
						x * l * e + c * t,
						0,
						x * l * t + c * e,
						x * t * t + g,
						x * t * e - c * l,
						0,
						x * l * e - c * t,
						x * t * e + c * l,
						x * e * e + g,
						0,
						0,
						0,
						0,
						1
					];
				};
				a.M44.lookat = function(e, c, g) {
					c = a.Vector.normalize(a.Vector.sub(c, e));
					g = a.Vector.normalize(g);
					g = a.Vector.normalize(a.Vector.cross(c, g));
					var l = a.M44.identity();
					b(g, l, 4, 0, 0);
					b(a.Vector.cross(g, c), l, 4, 1, 0);
					b(a.Vector.mulScalar(c, -1), l, 4, 2, 0);
					b(e, l, 4, 3, 0);
					e = a.M44.invert(l);
					return null === e ? a.M44.identity() : e;
				};
				a.M44.perspective = function(e, c, g) {
					var l = 1 / (c - e);
					g /= 2;
					g = Math.cos(g) / Math.sin(g);
					return [
						g,
						0,
						0,
						0,
						0,
						g,
						0,
						0,
						0,
						0,
						(c + e) * l,
						2 * c * e * l,
						0,
						0,
						-1,
						1
					];
				};
				a.M44.rc = function(e, c, g) {
					return e[4 * c + g];
				};
				a.M44.multiply = function() {
					return $a(4, arguments);
				};
				a.M44.invert = function(e) {
					var c = e[0], g = e[4], l = e[8], t = e[12], x = e[1], A = e[5], H = e[9], L = e[13], M = e[2], V = e[6], X = e[10], r = e[14], C = e[3], P = e[7], aa = e[11];
					e = e[15];
					var ja = c * A - g * x, va = c * H - l * x, wa = c * L - t * x, la = g * H - l * A, E = g * L - t * A, k = l * L - t * H, p = M * P - V * C, y = M * aa - X * C, z = M * e - r * C, B = V * aa - X * P, F = V * e - r * P, J = X * e - r * aa, ba = ja * J - va * F + wa * B + la * z - E * y + k * p, ca = 1 / ba;
					if (0 === ba || Infinity === ca) return null;
					ja *= ca;
					va *= ca;
					wa *= ca;
					la *= ca;
					E *= ca;
					k *= ca;
					p *= ca;
					y *= ca;
					z *= ca;
					B *= ca;
					F *= ca;
					J *= ca;
					c = [
						A * J - H * F + L * B,
						H * z - x * J - L * y,
						x * F - A * z + L * p,
						A * y - x * B - H * p,
						l * F - g * J - t * B,
						c * J - l * z + t * y,
						g * z - c * F - t * p,
						c * B - g * y + l * p,
						P * k - aa * E + e * la,
						aa * wa - C * k - e * va,
						C * E - P * wa + e * ja,
						P * va - C * la - aa * ja,
						X * E - V * k - r * la,
						M * k - X * wa + r * va,
						V * wa - M * E - r * ja,
						M * la - V * va + X * ja
					];
					return c.every(function(Ha) {
						return !isNaN(Ha) && Infinity !== Ha && -Infinity !== Ha;
					}) ? c : null;
				};
				a.M44.transpose = function(e) {
					return [
						e[0],
						e[4],
						e[8],
						e[12],
						e[1],
						e[5],
						e[9],
						e[13],
						e[2],
						e[6],
						e[10],
						e[14],
						e[3],
						e[7],
						e[11],
						e[15]
					];
				};
				a.M44.mustInvert = function(e) {
					e = a.M44.invert(e);
					if (null === e) throw "Matrix not invertible";
					return e;
				};
				a.M44.setupCamera = function(e, c, g) {
					var l = a.M44.lookat(g.eye, g.coa, g.up);
					g = a.M44.perspective(g.near, g.far, g.angle);
					c = [
						(e[2] - e[0]) / 2,
						(e[3] - e[1]) / 2,
						c
					];
					e = a.M44.multiply(a.M44.translated([
						(e[0] + e[2]) / 2,
						(e[1] + e[3]) / 2,
						0
					]), a.M44.scaled(c));
					return a.M44.multiply(e, g, l, a.M44.mustInvert(e));
				};
				a.ColorMatrix = {};
				a.ColorMatrix.identity = function() {
					var e = /* @__PURE__ */ new Float32Array(20);
					e[0] = 1;
					e[6] = 1;
					e[12] = 1;
					e[18] = 1;
					return e;
				};
				a.ColorMatrix.scaled = function(e, c, g, l) {
					var t = /* @__PURE__ */ new Float32Array(20);
					t[0] = e;
					t[6] = c;
					t[12] = g;
					t[18] = l;
					return t;
				};
				var kd = [
					[
						6,
						7,
						11,
						12
					],
					[
						0,
						10,
						2,
						12
					],
					[
						0,
						1,
						5,
						6
					]
				];
				a.ColorMatrix.rotated = function(e, c, g) {
					var l = a.ColorMatrix.identity();
					e = kd[e];
					l[e[0]] = g;
					l[e[1]] = c;
					l[e[2]] = -c;
					l[e[3]] = g;
					return l;
				};
				a.ColorMatrix.postTranslate = function(e, c, g, l, t) {
					e[4] += c;
					e[9] += g;
					e[14] += l;
					e[19] += t;
					return e;
				};
				a.ColorMatrix.concat = function(e, c) {
					for (var g = /* @__PURE__ */ new Float32Array(20), l = 0, t = 0; 20 > t; t += 5) {
						for (var x = 0; 4 > x; x++) g[l++] = e[t] * c[x] + e[t + 1] * c[x + 5] + e[t + 2] * c[x + 10] + e[t + 3] * c[x + 15];
						g[l++] = e[t] * c[4] + e[t + 1] * c[9] + e[t + 2] * c[14] + e[t + 3] * c[19] + e[t + 4];
					}
					return g;
				};
				(function(e) {
					e.Pd = e.Pd || [];
					e.Pd.push(function() {
						function c(r) {
							r && (r.dir = 0 === r.dir ? e.TextDirection.RTL : e.TextDirection.LTR);
							return r;
						}
						function g(r) {
							if (!r || !r.length) return [];
							for (var C = [], P = 0; P < r.length; P += 5) {
								var aa = e.LTRBRect(r[P], r[P + 1], r[P + 2], r[P + 3]), ja = e.TextDirection.LTR;
								0 === r[P + 4] && (ja = e.TextDirection.RTL);
								C.push({
									rect: aa,
									dir: ja
								});
							}
							e._free(r.byteOffset);
							return C;
						}
						function l(r) {
							r = r || {};
							void 0 === r.weight && (r.weight = e.FontWeight.Normal);
							r.width = r.width || e.FontWidth.Normal;
							r.slant = r.slant || e.FontSlant.Upright;
							return r;
						}
						function t(r) {
							if (!r || !r.length) return Q;
							for (var C = [], P = 0; P < r.length; P++) {
								var aa = x(r[P]);
								C.push(aa);
							}
							return w(C, "HEAPU32");
						}
						function x(r) {
							if (L[r]) return L[r];
							var C = Aa(r) + 1, P = e._malloc(C);
							Ba(r, P, C);
							return L[r] = P;
						}
						function A(r) {
							r._colorPtr = Y(r.color);
							r._foregroundColorPtr = Q;
							r._backgroundColorPtr = Q;
							r._decorationColorPtr = Q;
							r.foregroundColor && (r._foregroundColorPtr = Y(r.foregroundColor, M));
							r.backgroundColor && (r._backgroundColorPtr = Y(r.backgroundColor, V));
							r.decorationColor && (r._decorationColorPtr = Y(r.decorationColor, X));
							Array.isArray(r.fontFamilies) && r.fontFamilies.length ? (r._fontFamiliesPtr = t(r.fontFamilies), r._fontFamiliesLen = r.fontFamilies.length) : (r._fontFamiliesPtr = Q, r._fontFamiliesLen = 0);
							if (r.locale) {
								var C = r.locale;
								r._localePtr = x(C);
								r._localeLen = Aa(C);
							} else r._localePtr = Q, r._localeLen = 0;
							if (Array.isArray(r.shadows) && r.shadows.length) {
								C = r.shadows;
								var P = C.map(function(E) {
									return E.color || e.BLACK;
								}), aa = C.map(function(E) {
									return E.blurRadius || 0;
								});
								r._shadowLen = C.length;
								for (var ja = e._malloc(8 * C.length), va = ja / 4, wa = 0; wa < C.length; wa++) {
									var la = C[wa].offset || [0, 0];
									e.HEAPF32[va] = la[0];
									e.HEAPF32[va + 1] = la[1];
									va += 2;
								}
								r._shadowColorsPtr = D(P).Zd;
								r._shadowOffsetsPtr = ja;
								r._shadowBlurRadiiPtr = w(aa, "HEAPF32");
							} else r._shadowLen = 0, r._shadowColorsPtr = Q, r._shadowOffsetsPtr = Q, r._shadowBlurRadiiPtr = Q;
							Array.isArray(r.fontFeatures) && r.fontFeatures.length ? (C = r.fontFeatures, P = C.map(function(E) {
								return E.name;
							}), aa = C.map(function(E) {
								return E.value;
							}), r._fontFeatureLen = C.length, r._fontFeatureNamesPtr = t(P), r._fontFeatureValuesPtr = w(aa, "HEAPU32")) : (r._fontFeatureLen = 0, r._fontFeatureNamesPtr = Q, r._fontFeatureValuesPtr = Q);
							Array.isArray(r.fontVariations) && r.fontVariations.length ? (C = r.fontVariations, P = C.map(function(E) {
								return E.axis;
							}), aa = C.map(function(E) {
								return E.value;
							}), r._fontVariationLen = C.length, r._fontVariationAxesPtr = t(P), r._fontVariationValuesPtr = w(aa, "HEAPF32")) : (r._fontVariationLen = 0, r._fontVariationAxesPtr = Q, r._fontVariationValuesPtr = Q);
						}
						function H(r) {
							e._free(r._fontFamiliesPtr);
							e._free(r._shadowColorsPtr);
							e._free(r._shadowOffsetsPtr);
							e._free(r._shadowBlurRadiiPtr);
							e._free(r._fontFeatureNamesPtr);
							e._free(r._fontFeatureValuesPtr);
							e._free(r._fontVariationAxesPtr);
							e._free(r._fontVariationValuesPtr);
						}
						e.Paragraph.prototype.getRectsForRange = function(r, C, P, aa) {
							r = this._getRectsForRange(r, C, P, aa);
							return g(r);
						};
						e.Paragraph.prototype.getRectsForPlaceholders = function() {
							return g(this._getRectsForPlaceholders());
						};
						e.Paragraph.prototype.getGlyphInfoAt = function(r) {
							return c(this._getGlyphInfoAt(r));
						};
						e.Paragraph.prototype.getClosestGlyphInfoAtCoordinate = function(r, C) {
							return c(this._getClosestGlyphInfoAtCoordinate(r, C));
						};
						e.TypefaceFontProvider.prototype.registerFont = function(r, C) {
							r = e.Typeface.MakeTypefaceFromData(r);
							if (!r) return null;
							C = x(C);
							this._registerFont(r, C);
							r.delete();
						};
						e.ParagraphStyle = function(r) {
							r.disableHinting = r.disableHinting || !1;
							if (r.ellipsis) {
								var C = r.ellipsis;
								r._ellipsisPtr = x(C);
								r._ellipsisLen = Aa(C);
							} else r._ellipsisPtr = Q, r._ellipsisLen = 0;
							r.heightMultiplier ??= -1;
							r.maxLines = r.maxLines || 0;
							r.replaceTabCharacters = r.replaceTabCharacters || !1;
							C = (C = r.strutStyle) || {};
							C.strutEnabled = C.strutEnabled || !1;
							C.strutEnabled && Array.isArray(C.fontFamilies) && C.fontFamilies.length ? (C._fontFamiliesPtr = t(C.fontFamilies), C._fontFamiliesLen = C.fontFamilies.length) : (C._fontFamiliesPtr = Q, C._fontFamiliesLen = 0);
							C.fontStyle = l(C.fontStyle);
							C.fontSize ?? (C.fontSize = -1);
							C.heightMultiplier ?? (C.heightMultiplier = -1);
							C.halfLeading = C.halfLeading || !1;
							C.leading = C.leading || 0;
							C.forceStrutHeight = C.forceStrutHeight || !1;
							r.strutStyle = C;
							r.textAlign = r.textAlign || e.TextAlign.Start;
							r.textDirection = r.textDirection || e.TextDirection.LTR;
							r.textHeightBehavior = r.textHeightBehavior || e.TextHeightBehavior.All;
							r.textStyle = e.TextStyle(r.textStyle);
							r.applyRoundingHack = !1 !== r.applyRoundingHack;
							return r;
						};
						e.TextStyle = function(r) {
							r.color || (r.color = e.BLACK);
							r.decoration = r.decoration || 0;
							r.decorationThickness = r.decorationThickness || 0;
							r.decorationStyle = r.decorationStyle || e.DecorationStyle.Solid;
							r.textBaseline = r.textBaseline || e.TextBaseline.Alphabetic;
							r.fontSize ??= -1;
							r.letterSpacing = r.letterSpacing || 0;
							r.wordSpacing = r.wordSpacing || 0;
							r.heightMultiplier ??= -1;
							r.halfLeading = r.halfLeading || !1;
							r.fontStyle = l(r.fontStyle);
							return r;
						};
						var L = {}, M = e._malloc(16), V = e._malloc(16), X = e._malloc(16);
						e.ParagraphBuilder.Make = function(r, C) {
							A(r.textStyle);
							C = e.ParagraphBuilder._Make(r, C);
							H(r.textStyle);
							return C;
						};
						e.ParagraphBuilder.MakeFromFontProvider = function(r, C) {
							A(r.textStyle);
							C = e.ParagraphBuilder._MakeFromFontProvider(r, C);
							H(r.textStyle);
							return C;
						};
						e.ParagraphBuilder.MakeFromFontCollection = function(r, C) {
							A(r.textStyle);
							C = e.ParagraphBuilder._MakeFromFontCollection(r, C);
							H(r.textStyle);
							return C;
						};
						e.ParagraphBuilder.ShapeText = function(r, C, P) {
							let aa = 0;
							for (const ja of C) aa += ja.length;
							if (aa !== r.length) throw "Accumulated block lengths must equal text.length";
							return e.ParagraphBuilder._ShapeText(r, C, P);
						};
						e.ParagraphBuilder.prototype.pushStyle = function(r) {
							A(r);
							this._pushStyle(r);
							H(r);
						};
						e.ParagraphBuilder.prototype.pushPaintStyle = function(r, C, P) {
							A(r);
							this._pushPaintStyle(r, C, P);
							H(r);
						};
						e.ParagraphBuilder.prototype.addPlaceholder = function(r, C, P, aa, ja) {
							P = P || e.PlaceholderAlignment.Baseline;
							aa = aa || e.TextBaseline.Alphabetic;
							this._addPlaceholder(r || 0, C || 0, P, aa, ja || 0);
						};
						e.ParagraphBuilder.prototype.setWordsUtf8 = function(r) {
							var C = w(r, "HEAPU32");
							this._setWordsUtf8(C, r && r.length || 0);
							q(C, r);
						};
						e.ParagraphBuilder.prototype.setWordsUtf16 = function(r) {
							var C = w(r, "HEAPU32");
							this._setWordsUtf16(C, r && r.length || 0);
							q(C, r);
						};
						e.ParagraphBuilder.prototype.setGraphemeBreaksUtf8 = function(r) {
							var C = w(r, "HEAPU32");
							this._setGraphemeBreaksUtf8(C, r && r.length || 0);
							q(C, r);
						};
						e.ParagraphBuilder.prototype.setGraphemeBreaksUtf16 = function(r) {
							var C = w(r, "HEAPU32");
							this._setGraphemeBreaksUtf16(C, r && r.length || 0);
							q(C, r);
						};
						e.ParagraphBuilder.prototype.setLineBreaksUtf8 = function(r) {
							var C = w(r, "HEAPU32");
							this._setLineBreaksUtf8(C, r && r.length || 0);
							q(C, r);
						};
						e.ParagraphBuilder.prototype.setLineBreaksUtf16 = function(r) {
							var C = w(r, "HEAPU32");
							this._setLineBreaksUtf16(C, r && r.length || 0);
							q(C, r);
						};
					});
				})(u);
				a.Pd = a.Pd || [];
				a.Pd.push(function() {});
				a.Pd = a.Pd || [];
				a.Pd.push(function() {
					a.Canvas.prototype.drawText = function(e, c, g, l, t) {
						var x = Aa(e), A = a._malloc(x + 1);
						Ba(e, A, x + 1);
						this._drawSimpleText(A, x, c, g, t, l);
						a._free(A);
					};
					a.Canvas.prototype.drawGlyphs = function(e, c, g, l, t, x) {
						if (!(2 * e.length <= c.length)) throw "Not enough positions for the array of gyphs";
						a.Id(this.Gd);
						const A = w(e, "HEAPU16"), H = w(c, "HEAPF32");
						this._drawGlyphs(e.length, A, H, g, l, t, x);
						q(H, c);
						q(A, e);
					};
					a.Font.prototype.getGlyphBounds = function(e, c, g) {
						var l = w(e, "HEAPU16"), t = a._malloc(16 * e.length);
						this._getGlyphWidthBounds(l, e.length, Q, t, c || null);
						c = new Float32Array(a.HEAPU8.buffer, t, 4 * e.length);
						q(l, e);
						if (g) return g.set(c), a._free(t), g;
						e = Float32Array.from(c);
						a._free(t);
						return e;
					};
					a.Font.prototype.getGlyphIDs = function(e, c, g) {
						c || (c = e.length);
						var l = Aa(e) + 1, t = a._malloc(l);
						Ba(e, t, l);
						e = a._malloc(2 * c);
						c = this._getGlyphIDs(t, l - 1, c, e);
						a._free(t);
						if (0 > c) return a._free(e), null;
						t = new Uint16Array(a.HEAPU8.buffer, e, c);
						if (g) return g.set(t), a._free(e), g;
						g = Uint16Array.from(t);
						a._free(e);
						return g;
					};
					a.Font.prototype.getGlyphIntercepts = function(e, c, g, l) {
						var t = w(e, "HEAPU16"), x = w(c, "HEAPF32");
						return this._getGlyphIntercepts(t, e.length, !(e && e._ck), x, c.length, !(c && c._ck), g, l);
					};
					a.Font.prototype.getGlyphWidths = function(e, c, g) {
						var l = w(e, "HEAPU16"), t = a._malloc(4 * e.length);
						this._getGlyphWidthBounds(l, e.length, t, Q, c || null);
						c = new Float32Array(a.HEAPU8.buffer, t, e.length);
						q(l, e);
						if (g) return g.set(c), a._free(t), g;
						e = Float32Array.from(c);
						a._free(t);
						return e;
					};
					a.FontMgr.FromData = function() {
						if (!arguments.length) return null;
						var e = arguments;
						1 === e.length && Array.isArray(e[0]) && (e = arguments[0]);
						if (!e.length) return null;
						for (var c = [], g = [], l = 0; l < e.length; l++) {
							var t = new Uint8Array(e[l]), x = w(t, "HEAPU8");
							c.push(x);
							g.push(t.byteLength);
						}
						c = w(c, "HEAPU32");
						g = w(g, "HEAPU32");
						e = a.FontMgr._fromData(c, g, e.length);
						a._free(c);
						a._free(g);
						return e;
					};
					a.Typeface.MakeTypefaceFromData = function(e) {
						e = new Uint8Array(e);
						var c = w(e, "HEAPU8");
						return (e = a.Typeface._MakeTypefaceFromData(c, e.byteLength)) ? e : null;
					};
					a.Typeface.MakeFreeTypeFaceFromData = a.Typeface.MakeTypefaceFromData;
					a.Typeface.prototype.getGlyphIDs = function(e, c, g) {
						c || (c = e.length);
						var l = Aa(e) + 1, t = a._malloc(l);
						Ba(e, t, l);
						e = a._malloc(2 * c);
						c = this._getGlyphIDs(t, l - 1, c, e);
						a._free(t);
						if (0 > c) return a._free(e), null;
						t = new Uint16Array(a.HEAPU8.buffer, e, c);
						if (g) return g.set(t), a._free(e), g;
						g = Uint16Array.from(t);
						a._free(e);
						return g;
					};
					a.TextBlob.MakeOnPath = function(e, c, g, l) {
						if (e && e.length && c && c.countPoints()) {
							if (1 === c.countPoints()) return this.MakeFromText(e, g);
							l ||= 0;
							var t = g.getGlyphIDs(e);
							t = g.getGlyphWidths(t);
							var x = [];
							c = new a.ContourMeasureIter(c, !1, 1);
							for (var A = c.next(), H = /* @__PURE__ */ new Float32Array(4), L = 0; L < e.length && A; L++) {
								var M = t[L];
								l += M / 2;
								if (l > A.length()) {
									A.delete();
									A = c.next();
									if (!A) {
										e = e.substring(0, L);
										break;
									}
									l = M / 2;
								}
								A.getPosTan(l, H);
								var V = H[2], X = H[3];
								x.push(V, X, H[0] - M / 2 * V, H[1] - M / 2 * X);
								l += M / 2;
							}
							e = this.MakeFromRSXform(e, x, g);
							A && A.delete();
							c.delete();
							return e;
						}
					};
					a.TextBlob.MakeFromRSXform = function(e, c, g) {
						var l = Aa(e) + 1, t = a._malloc(l);
						Ba(e, t, l);
						e = w(c, "HEAPF32");
						g = a.TextBlob._MakeFromRSXform(t, l - 1, e, g);
						a._free(t);
						return g ? g : null;
					};
					a.TextBlob.MakeFromRSXformGlyphs = function(e, c, g) {
						var l = w(e, "HEAPU16");
						c = w(c, "HEAPF32");
						g = a.TextBlob._MakeFromRSXformGlyphs(l, 2 * e.length, c, g);
						q(l, e);
						return g ? g : null;
					};
					a.TextBlob.MakeFromGlyphs = function(e, c) {
						var g = w(e, "HEAPU16");
						c = a.TextBlob._MakeFromGlyphs(g, 2 * e.length, c);
						q(g, e);
						return c ? c : null;
					};
					a.TextBlob.MakeFromText = function(e, c) {
						var g = Aa(e) + 1, l = a._malloc(g);
						Ba(e, l, g);
						e = a.TextBlob._MakeFromText(l, g - 1, c);
						a._free(l);
						return e ? e : null;
					};
					a.MallocGlyphIDs = function(e) {
						return a.Malloc(Uint16Array, e);
					};
				});
				a.Pd = a.Pd || [];
				a.Pd.push(function() {
					a.MakePicture = function(e) {
						e = new Uint8Array(e);
						var c = a._malloc(e.byteLength);
						a.HEAPU8.set(e, c);
						return (e = a._MakePicture(c, e.byteLength)) ? e : null;
					};
				});
				a.Pd = a.Pd || [];
				a.Pd.push(function() {
					a.RuntimeEffect.Make = function(e, c) {
						return a.RuntimeEffect._Make(e, { onError: c || function(g) {
							console.log("RuntimeEffect error", g);
						} });
					};
					a.RuntimeEffect.MakeForBlender = function(e, c) {
						return a.RuntimeEffect._MakeForBlender(e, { onError: c || function(g) {
							console.log("RuntimeEffect error", g);
						} });
					};
					a.RuntimeEffect.prototype.makeShader = function(e, c) {
						var g = !e._ck, l = w(e, "HEAPF32");
						c = G(c);
						return this._makeShader(l, 4 * e.length, g, c);
					};
					a.RuntimeEffect.prototype.makeShaderWithChildren = function(e, c, g) {
						var l = !e._ck, t = w(e, "HEAPF32");
						g = G(g);
						for (var x = [], A = 0; A < c.length; A++) x.push(c[A].Fd.Md);
						c = w(x, "HEAPU32");
						return this._makeShaderWithChildren(t, 4 * e.length, l, c, x.length, g);
					};
					a.RuntimeEffect.prototype.makeBlender = function(e) {
						var c = !e._ck, g = w(e, "HEAPF32");
						return this._makeBlender(g, 4 * e.length, c);
					};
				});
				(function() {
					function e(E) {
						for (var k = 0; k < E.length; k++) if (void 0 !== E[k] && !Number.isFinite(E[k])) return !1;
						return !0;
					}
					function c(E) {
						var k = a.getColorComponents(E);
						E = k[0];
						var p = k[1], y = k[2];
						k = k[3];
						if (1 === k) return E = E.toString(16).toLowerCase(), p = p.toString(16).toLowerCase(), y = y.toString(16).toLowerCase(), E = 1 === E.length ? "0" + E : E, p = 1 === p.length ? "0" + p : p, y = 1 === y.length ? "0" + y : y, "#" + E + p + y;
						k = 0 === k || 1 === k ? k : k.toFixed(8);
						return "rgba(" + E + ", " + p + ", " + y + ", " + k + ")";
					}
					function g(E) {
						return a.parseColorString(E, va);
					}
					function l(E) {
						E = wa.exec(E);
						if (!E) return null;
						var k = parseFloat(E[4]), p = 16;
						switch (E[5]) {
							case "em":
							case "rem":
								p = 16 * k;
								break;
							case "pt":
								p = 4 * k / 3;
								break;
							case "px":
								p = k;
								break;
							case "pc":
								p = 16 * k;
								break;
							case "in":
								p = 96 * k;
								break;
							case "cm":
								p = 96 * k / 2.54;
								break;
							case "mm":
								p = 96 / 25.4 * k;
								break;
							case "q":
								p = 96 / 25.4 / 4 * k;
								break;
							case "%": p = 16 / 75 * k;
						}
						return {
							style: E[1],
							variant: E[2],
							weight: E[3],
							sizePx: p,
							family: E[6].trim()
						};
					}
					function t() {
						la ||= {
							"Noto Mono": { "*": a.Typeface.GetDefault() },
							monospace: { "*": a.Typeface.GetDefault() }
						};
					}
					function x(E) {
						this.Hd = E;
						this.Kd = new a.Paint();
						this.Kd.setAntiAlias(!0);
						this.Kd.setStrokeMiter(10);
						this.Kd.setStrokeCap(a.StrokeCap.Butt);
						this.Kd.setStrokeJoin(a.StrokeJoin.Miter);
						this.Le = "10px monospace";
						this.je = new a.Font(a.Typeface.GetDefault(), 10);
						this.je.setSubpixel(!0);
						this.Xd = this.de = a.BLACK;
						this.re = 0;
						this.Ce = a.TRANSPARENT;
						this.te = this.se = 0;
						this.De = this.he = 1;
						this.Be = 0;
						this.qe = [];
						this.Jd = a.BlendMode.SrcOver;
						this.Kd.setStrokeWidth(this.De);
						this.Kd.setBlendMode(this.Jd);
						this.Nd = new a.PathBuilder();
						this.Od = a.Matrix.identity();
						this.bf = [];
						this.xe = [];
						this.ie = function() {
							this.Nd.delete();
							this.Kd.delete();
							this.je.delete();
							this.xe.forEach(function(k) {
								k.ie();
							});
						};
						Object.defineProperty(this, "currentTransform", {
							enumerable: !0,
							get: function() {
								return {
									a: this.Od[0],
									c: this.Od[1],
									e: this.Od[2],
									b: this.Od[3],
									d: this.Od[4],
									f: this.Od[5]
								};
							},
							set: function(k) {
								k.a && this.setTransform(k.a, k.b, k.c, k.d, k.e, k.f);
							}
						});
						Object.defineProperty(this, "fillStyle", {
							enumerable: !0,
							get: function() {
								return f(this.Xd) ? c(this.Xd) : this.Xd;
							},
							set: function(k) {
								"string" === typeof k ? this.Xd = g(k) : k.pe && (this.Xd = k);
							}
						});
						Object.defineProperty(this, "font", {
							enumerable: !0,
							get: function() {
								return this.Le;
							},
							set: function(k) {
								var p = l(k);
								var y = (p.style || "normal") + "|" + (p.variant || "normal") + "|" + (p.weight || "normal");
								var z = p.family;
								t();
								y = la[z] ? la[z][y] || la[z]["*"] : a.Typeface.GetDefault();
								p.typeface = y;
								p && (this.je.setSize(p.sizePx), this.je.setTypeface(p.typeface), this.Le = k);
							}
						});
						Object.defineProperty(this, "globalAlpha", {
							enumerable: !0,
							get: function() {
								return this.he;
							},
							set: function(k) {
								!isFinite(k) || 0 > k || 1 < k || (this.he = k);
							}
						});
						Object.defineProperty(this, "globalCompositeOperation", {
							enumerable: !0,
							get: function() {
								switch (this.Jd) {
									case a.BlendMode.SrcOver: return "source-over";
									case a.BlendMode.DstOver: return "destination-over";
									case a.BlendMode.Src: return "copy";
									case a.BlendMode.Dst: return "destination";
									case a.BlendMode.Clear: return "clear";
									case a.BlendMode.SrcIn: return "source-in";
									case a.BlendMode.DstIn: return "destination-in";
									case a.BlendMode.SrcOut: return "source-out";
									case a.BlendMode.DstOut: return "destination-out";
									case a.BlendMode.SrcATop: return "source-atop";
									case a.BlendMode.DstATop: return "destination-atop";
									case a.BlendMode.Xor: return "xor";
									case a.BlendMode.Plus: return "lighter";
									case a.BlendMode.Multiply: return "multiply";
									case a.BlendMode.Screen: return "screen";
									case a.BlendMode.Overlay: return "overlay";
									case a.BlendMode.Darken: return "darken";
									case a.BlendMode.Lighten: return "lighten";
									case a.BlendMode.ColorDodge: return "color-dodge";
									case a.BlendMode.ColorBurn: return "color-burn";
									case a.BlendMode.HardLight: return "hard-light";
									case a.BlendMode.SoftLight: return "soft-light";
									case a.BlendMode.Difference: return "difference";
									case a.BlendMode.Exclusion: return "exclusion";
									case a.BlendMode.Hue: return "hue";
									case a.BlendMode.Saturation: return "saturation";
									case a.BlendMode.Color: return "color";
									case a.BlendMode.Luminosity: return "luminosity";
								}
							},
							set: function(k) {
								switch (k) {
									case "source-over":
										this.Jd = a.BlendMode.SrcOver;
										break;
									case "destination-over":
										this.Jd = a.BlendMode.DstOver;
										break;
									case "copy":
										this.Jd = a.BlendMode.Src;
										break;
									case "destination":
										this.Jd = a.BlendMode.Dst;
										break;
									case "clear":
										this.Jd = a.BlendMode.Clear;
										break;
									case "source-in":
										this.Jd = a.BlendMode.SrcIn;
										break;
									case "destination-in":
										this.Jd = a.BlendMode.DstIn;
										break;
									case "source-out":
										this.Jd = a.BlendMode.SrcOut;
										break;
									case "destination-out":
										this.Jd = a.BlendMode.DstOut;
										break;
									case "source-atop":
										this.Jd = a.BlendMode.SrcATop;
										break;
									case "destination-atop":
										this.Jd = a.BlendMode.DstATop;
										break;
									case "xor":
										this.Jd = a.BlendMode.Xor;
										break;
									case "lighter":
										this.Jd = a.BlendMode.Plus;
										break;
									case "plus-lighter":
										this.Jd = a.BlendMode.Plus;
										break;
									case "plus-darker": throw "plus-darker is not supported";
									case "multiply":
										this.Jd = a.BlendMode.Multiply;
										break;
									case "screen":
										this.Jd = a.BlendMode.Screen;
										break;
									case "overlay":
										this.Jd = a.BlendMode.Overlay;
										break;
									case "darken":
										this.Jd = a.BlendMode.Darken;
										break;
									case "lighten":
										this.Jd = a.BlendMode.Lighten;
										break;
									case "color-dodge":
										this.Jd = a.BlendMode.ColorDodge;
										break;
									case "color-burn":
										this.Jd = a.BlendMode.ColorBurn;
										break;
									case "hard-light":
										this.Jd = a.BlendMode.HardLight;
										break;
									case "soft-light":
										this.Jd = a.BlendMode.SoftLight;
										break;
									case "difference":
										this.Jd = a.BlendMode.Difference;
										break;
									case "exclusion":
										this.Jd = a.BlendMode.Exclusion;
										break;
									case "hue":
										this.Jd = a.BlendMode.Hue;
										break;
									case "saturation":
										this.Jd = a.BlendMode.Saturation;
										break;
									case "color":
										this.Jd = a.BlendMode.Color;
										break;
									case "luminosity":
										this.Jd = a.BlendMode.Luminosity;
										break;
									default: return;
								}
								this.Kd.setBlendMode(this.Jd);
							}
						});
						Object.defineProperty(this, "imageSmoothingEnabled", {
							enumerable: !0,
							get: function() {
								return !0;
							},
							set: function() {}
						});
						Object.defineProperty(this, "imageSmoothingQuality", {
							enumerable: !0,
							get: function() {
								return "high";
							},
							set: function() {}
						});
						Object.defineProperty(this, "lineCap", {
							enumerable: !0,
							get: function() {
								switch (this.Kd.getStrokeCap()) {
									case a.StrokeCap.Butt: return "butt";
									case a.StrokeCap.Round: return "round";
									case a.StrokeCap.Square: return "square";
								}
							},
							set: function(k) {
								switch (k) {
									case "butt":
										this.Kd.setStrokeCap(a.StrokeCap.Butt);
										break;
									case "round":
										this.Kd.setStrokeCap(a.StrokeCap.Round);
										break;
									case "square": this.Kd.setStrokeCap(a.StrokeCap.Square);
								}
							}
						});
						Object.defineProperty(this, "lineDashOffset", {
							enumerable: !0,
							get: function() {
								return this.Be;
							},
							set: function(k) {
								isFinite(k) && (this.Be = k);
							}
						});
						Object.defineProperty(this, "lineJoin", {
							enumerable: !0,
							get: function() {
								switch (this.Kd.getStrokeJoin()) {
									case a.StrokeJoin.Miter: return "miter";
									case a.StrokeJoin.Round: return "round";
									case a.StrokeJoin.Bevel: return "bevel";
								}
							},
							set: function(k) {
								switch (k) {
									case "miter":
										this.Kd.setStrokeJoin(a.StrokeJoin.Miter);
										break;
									case "round":
										this.Kd.setStrokeJoin(a.StrokeJoin.Round);
										break;
									case "bevel": this.Kd.setStrokeJoin(a.StrokeJoin.Bevel);
								}
							}
						});
						Object.defineProperty(this, "lineWidth", {
							enumerable: !0,
							get: function() {
								return this.Kd.getStrokeWidth();
							},
							set: function(k) {
								0 >= k || !k || (this.De = k, this.Kd.setStrokeWidth(k));
							}
						});
						Object.defineProperty(this, "miterLimit", {
							enumerable: !0,
							get: function() {
								return this.Kd.getStrokeMiter();
							},
							set: function(k) {
								0 >= k || !k || this.Kd.setStrokeMiter(k);
							}
						});
						Object.defineProperty(this, "shadowBlur", {
							enumerable: !0,
							get: function() {
								return this.re;
							},
							set: function(k) {
								0 > k || !isFinite(k) || (this.re = k);
							}
						});
						Object.defineProperty(this, "shadowColor", {
							enumerable: !0,
							get: function() {
								return c(this.Ce);
							},
							set: function(k) {
								this.Ce = g(k);
							}
						});
						Object.defineProperty(this, "shadowOffsetX", {
							enumerable: !0,
							get: function() {
								return this.se;
							},
							set: function(k) {
								isFinite(k) && (this.se = k);
							}
						});
						Object.defineProperty(this, "shadowOffsetY", {
							enumerable: !0,
							get: function() {
								return this.te;
							},
							set: function(k) {
								isFinite(k) && (this.te = k);
							}
						});
						Object.defineProperty(this, "strokeStyle", {
							enumerable: !0,
							get: function() {
								return c(this.de);
							},
							set: function(k) {
								"string" === typeof k ? this.de = g(k) : k.pe && (this.de = k);
							}
						});
						this.arc = function(k, p, y, z, B, F) {
							r(this.Nd, k, p, y, y, 0, z, B, F);
						};
						this.arcTo = function(k, p, y, z, B) {
							V(this.Nd, k, p, y, z, B);
						};
						this.beginPath = function() {
							this.Nd.delete();
							this.Nd = new a.PathBuilder();
						};
						this.bezierCurveTo = function(k, p, y, z, B, F) {
							var J = this.Nd;
							e([
								k,
								p,
								y,
								z,
								B,
								F
							]) && (J.isEmpty() && J.moveTo(k, p), J.cubicTo(k, p, y, z, B, F));
						};
						this.clearRect = function(k, p, y, z) {
							this.Kd.setStyle(a.PaintStyle.Fill);
							this.Kd.setBlendMode(a.BlendMode.Clear);
							this.Hd.drawRect(a.XYWHRect(k, p, y, z), this.Kd);
							this.Kd.setBlendMode(this.Jd);
						};
						this.clip = function(k, p) {
							if ("string" === typeof k) {
								p = k;
								var y = this.Nd.snapshot();
							} else k && k.ge && (y = k.ge());
							y ||= this.Nd.snapshot();
							p && "evenodd" === p.toLowerCase() ? y.setFillType(a.FillType.EvenOdd) : y.setFillType(a.FillType.Winding);
							this.Hd.clipPath(y, a.ClipOp.Intersect, !0);
							y.delete();
						};
						this.closePath = function() {
							var k = this.Nd;
							k.isEmpty() || 1 != k.countPoints() && k.close();
						};
						this.createImageData = function() {
							if (1 === arguments.length) {
								var k = arguments[0];
								return new L(new Uint8ClampedArray(4 * k.width * k.height), k.width, k.height);
							}
							if (2 === arguments.length) {
								k = arguments[0];
								var p = arguments[1];
								return new L(new Uint8ClampedArray(4 * k * p), k, p);
							}
							throw "createImageData expects 1 or 2 arguments, got " + arguments.length;
						};
						this.createLinearGradient = function(k, p, y, z) {
							if (e(arguments)) {
								var B = new M(k, p, y, z);
								this.xe.push(B);
								return B;
							}
						};
						this.createPattern = function(k, p) {
							k = new aa(k, p);
							this.xe.push(k);
							return k;
						};
						this.createRadialGradient = function(k, p, y, z, B, F) {
							if (e(arguments)) {
								var J = new ja(k, p, y, z, B, F);
								this.xe.push(J);
								return J;
							}
						};
						this.drawImage = function(k) {
							k instanceof H && (k = k.gf());
							var p = this.Ke();
							if (3 === arguments.length || 5 === arguments.length) var y = a.XYWHRect(arguments[1], arguments[2], arguments[3] || k.width(), arguments[4] || k.height()), z = a.XYWHRect(0, 0, k.width(), k.height());
							else if (9 === arguments.length) y = a.XYWHRect(arguments[5], arguments[6], arguments[7], arguments[8]), z = a.XYWHRect(arguments[1], arguments[2], arguments[3], arguments[4]);
							else throw "invalid number of args for drawImage, need 3, 5, or 9; got " + arguments.length;
							this.Hd.drawImageRect(k, z, y, p, !1);
							p.dispose();
						};
						this.ellipse = function(k, p, y, z, B, F, J, ba) {
							r(this.Nd, k, p, y, z, B, F, J, ba);
						};
						this.Ke = function() {
							var k = this.Kd.copy();
							k.setStyle(a.PaintStyle.Fill);
							if (f(this.Xd)) {
								var p = a.multiplyByAlpha(this.Xd, this.he);
								k.setColor(p);
							} else p = this.Xd.pe(this.Od), k.setColor(a.Color(0, 0, 0, this.he)), k.setShader(p);
							k.dispose = function() {
								this.delete();
							};
							return k;
						};
						this.fill = function(k, p) {
							if ("string" === typeof k) {
								p = k;
								var y = this.Nd.snapshot();
							} else k && k.ge && (y = k.ge());
							k || (y = this.Nd.snapshot());
							if ("evenodd" === p) y.setFillType(a.FillType.EvenOdd);
							else {
								if ("nonzero" !== p && p) throw "invalid fill rule";
								y.setFillType(a.FillType.Winding);
							}
							k = this.Ke();
							if (p = this.ue(k)) this.Hd.save(), this.ne(), this.Hd.drawPath(y, p), this.Hd.restore(), p.dispose();
							this.Hd.drawPath(y, k);
							k.dispose();
							y.delete();
						};
						this.fillRect = function(k, p, y, z) {
							var B = this.Ke(), F = this.ue(B);
							F && (this.Hd.save(), this.ne(), this.Hd.drawRect(a.XYWHRect(k, p, y, z), F), this.Hd.restore(), F.dispose());
							this.Hd.drawRect(a.XYWHRect(k, p, y, z), B);
							B.dispose();
						};
						this.fillText = function(k, p, y) {
							var z = this.Ke();
							k = a.TextBlob.MakeFromText(k, this.je);
							var B = this.ue(z);
							B && (this.Hd.save(), this.ne(), this.Hd.drawTextBlob(k, p, y, B), this.Hd.restore(), B.dispose());
							this.Hd.drawTextBlob(k, p, y, z);
							k.delete();
							z.dispose();
						};
						this.getImageData = function(k, p, y, z) {
							return (k = this.Hd.readPixels(k, p, {
								width: y,
								height: z,
								colorType: a.ColorType.RGBA_8888,
								alphaType: a.AlphaType.Unpremul,
								colorSpace: a.ColorSpace.SRGB
							})) ? new L(new Uint8ClampedArray(k.buffer), y, z) : null;
						};
						this.getLineDash = function() {
							return this.qe.slice();
						};
						this.cf = function(k) {
							var p = a.Matrix.invert(this.Od);
							a.Matrix.mapPoints(p, k);
							return k;
						};
						this.isPointInPath = function(k, p, y) {
							var z = arguments;
							if (3 === z.length) var B = this.Nd.snapshot();
							else if (4 === z.length) B = z[0].copy(), k = z[1], p = z[2], y = z[3];
							else throw "invalid arg count, need 3 or 4, got " + z.length;
							if (!isFinite(k) || !isFinite(p)) return B.delete(), !1;
							y = y || "nonzero";
							if ("nonzero" !== y && "evenodd" !== y) return B.delete(), !1;
							z = this.cf([k, p]);
							k = z[0];
							p = z[1];
							B.setFillType("nonzero" === y ? a.FillType.Winding : a.FillType.EvenOdd);
							z = B.contains(k, p);
							B.delete();
							return z;
						};
						this.isPointInStroke = function(k, p) {
							var y = arguments;
							if (2 === y.length) var z = this.Nd.snapshot();
							else if (3 === y.length) z = y[0].copy(), k = y[1], p = y[2];
							else throw "invalid arg count, need 2 or 3, got " + y.length;
							if (!isFinite(k) || !isFinite(p)) return z.delete(), !1;
							y = this.cf([k, p]);
							k = y[0];
							p = y[1];
							z.setFillType(a.FillType.Winding);
							y = z.makeStroked({
								width: this.lineWidth,
								miter_limit: this.miterLimit,
								cap: this.Kd.getStrokeCap(),
								join: this.Kd.getStrokeJoin(),
								precision: .3
							});
							var B = y.contains(k, p);
							y.delete();
							z.delete();
							return B;
						};
						this.lineTo = function(k, p) {
							C(this.Nd, k, p);
						};
						this.measureText = function(k) {
							k = this.je.getGlyphIDs(k);
							k = this.je.getGlyphWidths(k);
							let p = 0;
							for (const y of k) p += y;
							return { width: p };
						};
						this.moveTo = function(k, p) {
							var y = this.Nd;
							e([k, p]) && y.moveTo(k, p);
						};
						this.putImageData = function(k, p, y, z, B, F, J) {
							if (e([
								p,
								y,
								z,
								B,
								F,
								J
							])) {
								if (void 0 === z) this.Hd.writePixels(k.data, k.width, k.height, p, y);
								else if (z = z || 0, B = B || 0, F = F || k.width, J = J || k.height, 0 > F && (z += F, F = Math.abs(F)), 0 > J && (B += J, J = Math.abs(J)), 0 > z && (F += z, z = 0), 0 > B && (J += B, B = 0), !(0 >= F || 0 >= J)) {
									k = a.MakeImage({
										width: k.width,
										height: k.height,
										alphaType: a.AlphaType.Unpremul,
										colorType: a.ColorType.RGBA_8888,
										colorSpace: a.ColorSpace.SRGB
									}, k.data, 4 * k.width);
									var ba = a.XYWHRect(z, B, F, J);
									p = a.XYWHRect(p + z, y + B, F, J);
									y = a.Matrix.invert(this.Od);
									this.Hd.save();
									this.Hd.concat(y);
									this.Hd.drawImageRect(k, ba, p, null, !1);
									this.Hd.restore();
									k.delete();
								}
							}
						};
						this.quadraticCurveTo = function(k, p, y, z) {
							var B = this.Nd;
							e([
								k,
								p,
								y,
								z
							]) && (B.isEmpty() && B.moveTo(k, p), B.quadTo(k, p, y, z));
						};
						this.rect = function(k, p, y, z) {
							var B = this.Nd;
							k = a.XYWHRect(k, p, y, z);
							e(k) && B.addRect(k);
						};
						this.resetTransform = function() {
							this.Nd.transform(this.Od);
							var k = a.Matrix.invert(this.Od);
							this.Hd.concat(k);
							this.Od = this.Hd.getTotalMatrix();
						};
						this.restore = function() {
							var k = this.bf.pop();
							if (k) {
								var p = a.Matrix.multiply(this.Od, a.Matrix.invert(k.vf));
								this.Nd.transform(p);
								this.Kd.delete();
								this.Kd = k.Lf;
								this.qe = k.Jf;
								this.De = k.Xf;
								this.de = k.Wf;
								this.Xd = k.fs;
								this.se = k.Uf;
								this.te = k.Vf;
								this.re = k.sb;
								this.Ce = k.Tf;
								this.he = k.ga;
								this.Jd = k.Bf;
								this.Be = k.Kf;
								this.Le = k.Af;
								this.Hd.restore();
								this.Od = this.Hd.getTotalMatrix();
							}
						};
						this.rotate = function(k) {
							if (isFinite(k)) {
								var p = a.Matrix.rotated(-k);
								this.Nd.transform(p);
								this.Hd.rotate(k / Math.PI * 180, 0, 0);
								this.Od = this.Hd.getTotalMatrix();
							}
						};
						this.save = function() {
							if (this.Xd.oe) {
								var k = this.Xd.oe();
								this.xe.push(k);
							} else k = this.Xd;
							if (this.de.oe) {
								var p = this.de.oe();
								this.xe.push(p);
							} else p = this.de;
							this.bf.push({
								vf: this.Od.slice(),
								Jf: this.qe.slice(),
								Xf: this.De,
								Wf: p,
								fs: k,
								Uf: this.se,
								Vf: this.te,
								sb: this.re,
								Tf: this.Ce,
								ga: this.he,
								Kf: this.Be,
								Bf: this.Jd,
								Lf: this.Kd.copy(),
								Af: this.Le
							});
							this.Hd.save();
						};
						this.scale = function(k, p) {
							if (e(arguments)) {
								var y = a.Matrix.scaled(1 / k, 1 / p);
								this.Nd.transform(y);
								this.Hd.scale(k, p);
								this.Od = this.Hd.getTotalMatrix();
							}
						};
						this.setLineDash = function(k) {
							for (var p = 0; p < k.length; p++) if (!isFinite(k[p]) || 0 > k[p]) return;
							1 === k.length % 2 && Array.prototype.push.apply(k, k);
							this.qe = k;
						};
						this.setTransform = function(k, p, y, z, B, F) {
							e(arguments) && (this.resetTransform(), this.transform(k, p, y, z, B, F));
						};
						this.ne = function() {
							var k = a.Matrix.invert(this.Od);
							this.Hd.concat(k);
							this.Hd.concat(a.Matrix.translated(this.se, this.te));
							this.Hd.concat(this.Od);
						};
						this.ue = function(k) {
							var p = a.multiplyByAlpha(this.Ce, this.he);
							if (!a.getColorComponents(p)[3] || !(this.re || this.te || this.se)) return null;
							k = k.copy();
							k.setColor(p);
							var y = a.MaskFilter.MakeBlur(a.BlurStyle.Normal, this.re / 2, !1);
							k.setMaskFilter(y);
							k.dispose = function() {
								y.delete();
								this.delete();
							};
							return k;
						};
						this.Ue = function() {
							var k = this.Kd.copy();
							k.setStyle(a.PaintStyle.Stroke);
							if (f(this.de)) {
								var p = a.multiplyByAlpha(this.de, this.he);
								k.setColor(p);
							} else p = this.de.pe(this.Od), k.setColor(a.Color(0, 0, 0, this.he)), k.setShader(p);
							k.setStrokeWidth(this.De);
							if (this.qe.length) {
								var y = a.PathEffect.MakeDash(this.qe, this.Be);
								k.setPathEffect(y);
							}
							k.dispose = function() {
								y && y.delete();
								this.delete();
							};
							return k;
						};
						this.stroke = function(k) {
							k = k ? k.ge() : this.Nd.snapshot();
							var p = this.Ue(), y = this.ue(p);
							y && (this.Hd.save(), this.ne(), this.Hd.drawPath(k, y), this.Hd.restore(), y.dispose());
							this.Hd.drawPath(k, p);
							k.delete();
							p.dispose();
						};
						this.strokeRect = function(k, p, y, z) {
							var B = this.Ue(), F = this.ue(B);
							F && (this.Hd.save(), this.ne(), this.Hd.drawRect(a.XYWHRect(k, p, y, z), F), this.Hd.restore(), F.dispose());
							this.Hd.drawRect(a.XYWHRect(k, p, y, z), B);
							B.dispose();
						};
						this.strokeText = function(k, p, y) {
							var z = this.Ue();
							k = a.TextBlob.MakeFromText(k, this.je);
							var B = this.ue(z);
							B && (this.Hd.save(), this.ne(), this.Hd.drawTextBlob(k, p, y, B), this.Hd.restore(), B.dispose());
							this.Hd.drawTextBlob(k, p, y, z);
							k.delete();
							z.dispose();
						};
						this.translate = function(k, p) {
							if (e(arguments)) {
								var y = a.Matrix.translated(-k, -p);
								this.Nd.transform(y);
								this.Hd.translate(k, p);
								this.Od = this.Hd.getTotalMatrix();
							}
						};
						this.transform = function(k, p, y, z, B, F) {
							k = [
								k,
								y,
								B,
								p,
								z,
								F,
								0,
								0,
								1
							];
							p = a.Matrix.invert(k);
							this.Nd.transform(p);
							this.Hd.concat(k);
							this.Od = this.Hd.getTotalMatrix();
						};
						this.addHitRegion = function() {};
						this.clearHitRegions = function() {};
						this.drawFocusIfNeeded = function() {};
						this.removeHitRegion = function() {};
						this.scrollPathIntoView = function() {};
						Object.defineProperty(this, "canvas", {
							value: null,
							writable: !1
						});
					}
					function A(E) {
						this.Ve = E;
						this.Gd = new x(E.getCanvas());
						this.Me = [];
						this.decodeImage = function(k) {
							k = a.MakeImageFromEncoded(k);
							if (!k) throw "Invalid input";
							this.Me.push(k);
							return new H(k);
						};
						this.loadFont = function(k, p) {
							k = a.Typeface.MakeTypefaceFromData(k);
							if (!k) return null;
							this.Me.push(k);
							var y = (p.style || "normal") + "|" + (p.variant || "normal") + "|" + (p.weight || "normal");
							p = p.family;
							t();
							la[p] || (la[p] = { "*": k });
							la[p][y] = k;
						};
						this.makePath2D = function(k) {
							k = new P(k);
							this.Me.push(k.ge());
							return k;
						};
						this.getContext = function(k) {
							return "2d" === k ? this.Gd : null;
						};
						this.toDataURL = function(k, p) {
							this.Ve.flush();
							var y = this.Ve.makeImageSnapshot();
							if (y) {
								k = k || "image/png";
								var z = a.ImageFormat.PNG;
								"image/jpeg" === k && (z = a.ImageFormat.JPEG);
								if (p = y.encodeToBytes(z, p || .92)) {
									y.delete();
									k = "data:" + k + ";base64,";
									if ("undefined" !== typeof Buffer) p = Buffer.from(p).toString("base64");
									else {
										y = 0;
										z = p.length;
										for (var B = "", F; y < z;) F = p.slice(y, Math.min(y + 32768, z)), B += String.fromCharCode.apply(null, F), y += 32768;
										p = btoa(B);
									}
									return k + p;
								}
							}
						};
						this.dispose = function() {
							this.Gd.ie();
							this.Me.forEach(function(k) {
								k.delete();
							});
							this.Ve.dispose();
						};
					}
					function H(E) {
						this.width = E.width();
						this.height = E.height();
						this.naturalWidth = this.width;
						this.naturalHeight = this.height;
						this.gf = function() {
							return E;
						};
					}
					function L(E, k, p) {
						if (!k || 0 === p) throw new TypeError("invalid dimensions, width and height must be non-zero");
						if (E.length % 4) throw new TypeError("arr must be a multiple of 4");
						p = p || E.length / (4 * k);
						Object.defineProperty(this, "data", {
							value: E,
							writable: !1
						});
						Object.defineProperty(this, "height", {
							value: p,
							writable: !1
						});
						Object.defineProperty(this, "width", {
							value: k,
							writable: !1
						});
					}
					function M(E, k, p, y) {
						this.Td = null;
						this.be = [];
						this.Ud = [];
						this.addColorStop = function(z, B) {
							if (0 > z || 1 < z || !isFinite(z)) throw "offset must be between 0 and 1 inclusively";
							B = g(B);
							var F = this.Ud.indexOf(z);
							if (-1 !== F) this.be[F] = B;
							else {
								for (F = 0; F < this.Ud.length && !(this.Ud[F] > z); F++);
								this.Ud.splice(F, 0, z);
								this.be.splice(F, 0, B);
							}
						};
						this.oe = function() {
							var z = new M(E, k, p, y);
							z.be = this.be.slice();
							z.Ud = this.Ud.slice();
							return z;
						};
						this.ie = function() {
							this.Td && (this.Td.delete(), this.Td = null);
						};
						this.pe = function(z) {
							var B = [
								E,
								k,
								p,
								y
							];
							a.Matrix.mapPoints(z, B);
							z = B[0];
							var F = B[1], J = B[2];
							B = B[3];
							this.ie();
							return this.Td = a.Shader.MakeLinearGradient([z, F], [J, B], this.be, this.Ud, a.TileMode.Clamp);
						};
					}
					function V(E, k, p, y, z, B) {
						if (e([
							k,
							p,
							y,
							z,
							B
						])) {
							if (0 > B) throw "radii cannot be negative";
							E.isEmpty() && E.moveTo(k, p);
							E.arcToTangent(k, p, y, z, B);
						}
					}
					function X(E, k, p, y, z, B, F) {
						F = (F - B) / Math.PI * 180;
						B = B / Math.PI * 180;
						k = a.LTRBRect(k - y, p - z, k + y, p + z);
						1e-5 > Math.abs(Math.abs(F) - 360) ? (p = F / 2, E.arcToOval(k, B, p, !1), E.arcToOval(k, B + p, p, !1)) : E.arcToOval(k, B, F, !1);
					}
					function r(E, k, p, y, z, B, F, J, ba) {
						if (e([
							k,
							p,
							y,
							z,
							B,
							F,
							J
						])) {
							if (0 > y || 0 > z) throw "radii cannot be negative";
							var ca = 2 * Math.PI, Ha = F % ca;
							0 > Ha && (Ha += ca);
							var ab = Ha - F;
							F = Ha;
							J += ab;
							!ba && J - F >= ca ? J = F + ca : ba && F - J >= ca ? J = F - ca : !ba && F > J ? J = F + (ca - (F - J) % ca) : ba && F < J && (J = F - (ca - (J - F) % ca));
							B ? (ba = a.Matrix.rotated(B, k, p), B = a.Matrix.rotated(-B, k, p), E.transform(B), X(E, k, p, y, z, F, J), E.transform(ba)) : X(E, k, p, y, z, F, J);
						}
					}
					function C(E, k, p) {
						e([k, p]) && (E.isEmpty() && E.moveTo(k, p), E.lineTo(k, p));
					}
					function P(E) {
						this.Vd = new a.PathBuilder();
						"string" === typeof E ? (E = a.Path.MakeFromSVGString(E), this.Vd.addPath(E), E.delete()) : E && E.ge && (E = E.ge(), this.Vd.addPath(E), E.delete());
						this.ge = function() {
							return this.Vd.snapshot();
						};
						this.addPath = function(k, p) {
							p ||= {
								a: 1,
								c: 0,
								e: 0,
								b: 0,
								d: 1,
								f: 0
							};
							k = k.ge();
							this.Vd.addPath(k, [
								p.a,
								p.c,
								p.e,
								p.b,
								p.d,
								p.f
							]);
							k.delete();
						};
						this.arc = function(k, p, y, z, B, F) {
							r(this.Vd, k, p, y, y, 0, z, B, F);
						};
						this.arcTo = function(k, p, y, z, B) {
							V(this.Vd, k, p, y, z, B);
						};
						this.bezierCurveTo = function(k, p, y, z, B, F) {
							var J = this.Vd;
							e([
								k,
								p,
								y,
								z,
								B,
								F
							]) && (J.isEmpty() && J.moveTo(k, p), J.cubicTo(k, p, y, z, B, F));
						};
						this.closePath = function() {
							var k = this.Vd;
							k.isEmpty() || 1 != k.countPoints() && k.close();
						};
						this.ellipse = function(k, p, y, z, B, F, J, ba) {
							r(this.Vd, k, p, y, z, B, F, J, ba);
						};
						this.lineTo = function(k, p) {
							C(this.Vd, k, p);
						};
						this.moveTo = function(k, p) {
							var y = this.Vd;
							e([k, p]) && y.moveTo(k, p);
						};
						this.quadraticCurveTo = function(k, p, y, z) {
							var B = this.Vd;
							e([
								k,
								p,
								y,
								z
							]) && (B.isEmpty() && B.moveTo(k, p), B.quadTo(k, p, y, z));
						};
						this.rect = function(k, p, y, z) {
							var B = this.Vd;
							k = a.XYWHRect(k, p, y, z);
							e(k) && B.addRect(k);
						};
					}
					function aa(E, k) {
						this.Td = null;
						E instanceof H && (E = E.gf());
						this.qf = E;
						this._transform = a.Matrix.identity();
						"" === k && (k = "repeat");
						switch (k) {
							case "repeat-x":
								this.ve = a.TileMode.Repeat;
								this.we = a.TileMode.Decal;
								break;
							case "repeat-y":
								this.ve = a.TileMode.Decal;
								this.we = a.TileMode.Repeat;
								break;
							case "repeat":
								this.we = this.ve = a.TileMode.Repeat;
								break;
							case "no-repeat":
								this.we = this.ve = a.TileMode.Decal;
								break;
							default: throw "invalid repetition mode " + k;
						}
						this.setTransform = function(p) {
							p = [
								p.a,
								p.c,
								p.e,
								p.b,
								p.d,
								p.f,
								0,
								0,
								1
							];
							e(p) && (this._transform = p);
						};
						this.oe = function() {
							var p = new aa();
							p.ve = this.ve;
							p.we = this.we;
							return p;
						};
						this.ie = function() {
							this.Td && (this.Td.delete(), this.Td = null);
						};
						this.pe = function() {
							this.ie();
							return this.Td = this.qf.makeShaderCubic(this.ve, this.we, 1 / 3, 1 / 3, this._transform);
						};
					}
					function ja(E, k, p, y, z, B) {
						this.Td = null;
						this.be = [];
						this.Ud = [];
						this.addColorStop = function(F, J) {
							if (0 > F || 1 < F || !isFinite(F)) throw "offset must be between 0 and 1 inclusively";
							J = g(J);
							var ba = this.Ud.indexOf(F);
							if (-1 !== ba) this.be[ba] = J;
							else {
								for (ba = 0; ba < this.Ud.length && !(this.Ud[ba] > F); ba++);
								this.Ud.splice(ba, 0, F);
								this.be.splice(ba, 0, J);
							}
						};
						this.oe = function() {
							var F = new ja(E, k, p, y, z, B);
							F.be = this.be.slice();
							F.Ud = this.Ud.slice();
							return F;
						};
						this.ie = function() {
							this.Td && (this.Td.delete(), this.Td = null);
						};
						this.pe = function(F) {
							var J = [
								E,
								k,
								y,
								z
							];
							a.Matrix.mapPoints(F, J);
							var ba = J[0], ca = J[1], Ha = J[2];
							J = J[3];
							var ab = (Math.abs(F[0]) + Math.abs(F[4])) / 2;
							F = p * ab;
							ab *= B;
							this.ie();
							return this.Td = a.Shader.MakeTwoPointConicalGradient([ba, ca], F, [Ha, J], ab, this.be, this.Ud, a.TileMode.Clamp);
						};
					}
					a._testing = {};
					var va = {
						aliceblue: Float32Array.of(.941, .973, 1, 1),
						antiquewhite: Float32Array.of(.98, .922, .843, 1),
						aqua: Float32Array.of(0, 1, 1, 1),
						aquamarine: Float32Array.of(.498, 1, .831, 1),
						azure: Float32Array.of(.941, 1, 1, 1),
						beige: Float32Array.of(.961, .961, .863, 1),
						bisque: Float32Array.of(1, .894, .769, 1),
						black: Float32Array.of(0, 0, 0, 1),
						blanchedalmond: Float32Array.of(1, .922, .804, 1),
						blue: Float32Array.of(0, 0, 1, 1),
						blueviolet: Float32Array.of(.541, .169, .886, 1),
						brown: Float32Array.of(.647, .165, .165, 1),
						burlywood: Float32Array.of(.871, .722, .529, 1),
						cadetblue: Float32Array.of(.373, .62, .627, 1),
						chartreuse: Float32Array.of(.498, 1, 0, 1),
						chocolate: Float32Array.of(.824, .412, .118, 1),
						coral: Float32Array.of(1, .498, .314, 1),
						cornflowerblue: Float32Array.of(.392, .584, .929, 1),
						cornsilk: Float32Array.of(1, .973, .863, 1),
						crimson: Float32Array.of(.863, .078, .235, 1),
						cyan: Float32Array.of(0, 1, 1, 1),
						darkblue: Float32Array.of(0, 0, .545, 1),
						darkcyan: Float32Array.of(0, .545, .545, 1),
						darkgoldenrod: Float32Array.of(.722, .525, .043, 1),
						darkgray: Float32Array.of(.663, .663, .663, 1),
						darkgreen: Float32Array.of(0, .392, 0, 1),
						darkgrey: Float32Array.of(.663, .663, .663, 1),
						darkkhaki: Float32Array.of(.741, .718, .42, 1),
						darkmagenta: Float32Array.of(.545, 0, .545, 1),
						darkolivegreen: Float32Array.of(.333, .42, .184, 1),
						darkorange: Float32Array.of(1, .549, 0, 1),
						darkorchid: Float32Array.of(.6, .196, .8, 1),
						darkred: Float32Array.of(.545, 0, 0, 1),
						darksalmon: Float32Array.of(.914, .588, .478, 1),
						darkseagreen: Float32Array.of(.561, .737, .561, 1),
						darkslateblue: Float32Array.of(.282, .239, .545, 1),
						darkslategray: Float32Array.of(.184, .31, .31, 1),
						darkslategrey: Float32Array.of(.184, .31, .31, 1),
						darkturquoise: Float32Array.of(0, .808, .82, 1),
						darkviolet: Float32Array.of(.58, 0, .827, 1),
						deeppink: Float32Array.of(1, .078, .576, 1),
						deepskyblue: Float32Array.of(0, .749, 1, 1),
						dimgray: Float32Array.of(.412, .412, .412, 1),
						dimgrey: Float32Array.of(.412, .412, .412, 1),
						dodgerblue: Float32Array.of(.118, .565, 1, 1),
						firebrick: Float32Array.of(.698, .133, .133, 1),
						floralwhite: Float32Array.of(1, .98, .941, 1),
						forestgreen: Float32Array.of(.133, .545, .133, 1),
						fuchsia: Float32Array.of(1, 0, 1, 1),
						gainsboro: Float32Array.of(.863, .863, .863, 1),
						ghostwhite: Float32Array.of(.973, .973, 1, 1),
						gold: Float32Array.of(1, .843, 0, 1),
						goldenrod: Float32Array.of(.855, .647, .125, 1),
						gray: Float32Array.of(.502, .502, .502, 1),
						green: Float32Array.of(0, .502, 0, 1),
						greenyellow: Float32Array.of(.678, 1, .184, 1),
						grey: Float32Array.of(.502, .502, .502, 1),
						honeydew: Float32Array.of(.941, 1, .941, 1),
						hotpink: Float32Array.of(1, .412, .706, 1),
						indianred: Float32Array.of(.804, .361, .361, 1),
						indigo: Float32Array.of(.294, 0, .51, 1),
						ivory: Float32Array.of(1, 1, .941, 1),
						khaki: Float32Array.of(.941, .902, .549, 1),
						lavender: Float32Array.of(.902, .902, .98, 1),
						lavenderblush: Float32Array.of(1, .941, .961, 1),
						lawngreen: Float32Array.of(.486, .988, 0, 1),
						lemonchiffon: Float32Array.of(1, .98, .804, 1),
						lightblue: Float32Array.of(.678, .847, .902, 1),
						lightcoral: Float32Array.of(.941, .502, .502, 1),
						lightcyan: Float32Array.of(.878, 1, 1, 1),
						lightgoldenrodyellow: Float32Array.of(.98, .98, .824, 1),
						lightgray: Float32Array.of(.827, .827, .827, 1),
						lightgreen: Float32Array.of(.565, .933, .565, 1),
						lightgrey: Float32Array.of(.827, .827, .827, 1),
						lightpink: Float32Array.of(1, .714, .757, 1),
						lightsalmon: Float32Array.of(1, .627, .478, 1),
						lightseagreen: Float32Array.of(.125, .698, .667, 1),
						lightskyblue: Float32Array.of(.529, .808, .98, 1),
						lightslategray: Float32Array.of(.467, .533, .6, 1),
						lightslategrey: Float32Array.of(.467, .533, .6, 1),
						lightsteelblue: Float32Array.of(.69, .769, .871, 1),
						lightyellow: Float32Array.of(1, 1, .878, 1),
						lime: Float32Array.of(0, 1, 0, 1),
						limegreen: Float32Array.of(.196, .804, .196, 1),
						linen: Float32Array.of(.98, .941, .902, 1),
						magenta: Float32Array.of(1, 0, 1, 1),
						maroon: Float32Array.of(.502, 0, 0, 1),
						mediumaquamarine: Float32Array.of(.4, .804, .667, 1),
						mediumblue: Float32Array.of(0, 0, .804, 1),
						mediumorchid: Float32Array.of(.729, .333, .827, 1),
						mediumpurple: Float32Array.of(.576, .439, .859, 1),
						mediumseagreen: Float32Array.of(.235, .702, .443, 1),
						mediumslateblue: Float32Array.of(.482, .408, .933, 1),
						mediumspringgreen: Float32Array.of(0, .98, .604, 1),
						mediumturquoise: Float32Array.of(.282, .82, .8, 1),
						mediumvioletred: Float32Array.of(.78, .082, .522, 1),
						midnightblue: Float32Array.of(.098, .098, .439, 1),
						mintcream: Float32Array.of(.961, 1, .98, 1),
						mistyrose: Float32Array.of(1, .894, .882, 1),
						moccasin: Float32Array.of(1, .894, .71, 1),
						navajowhite: Float32Array.of(1, .871, .678, 1),
						navy: Float32Array.of(0, 0, .502, 1),
						oldlace: Float32Array.of(.992, .961, .902, 1),
						olive: Float32Array.of(.502, .502, 0, 1),
						olivedrab: Float32Array.of(.42, .557, .137, 1),
						orange: Float32Array.of(1, .647, 0, 1),
						orangered: Float32Array.of(1, .271, 0, 1),
						orchid: Float32Array.of(.855, .439, .839, 1),
						palegoldenrod: Float32Array.of(.933, .91, .667, 1),
						palegreen: Float32Array.of(.596, .984, .596, 1),
						paleturquoise: Float32Array.of(.686, .933, .933, 1),
						palevioletred: Float32Array.of(.859, .439, .576, 1),
						papayawhip: Float32Array.of(1, .937, .835, 1),
						peachpuff: Float32Array.of(1, .855, .725, 1),
						peru: Float32Array.of(.804, .522, .247, 1),
						pink: Float32Array.of(1, .753, .796, 1),
						plum: Float32Array.of(.867, .627, .867, 1),
						powderblue: Float32Array.of(.69, .878, .902, 1),
						purple: Float32Array.of(.502, 0, .502, 1),
						rebeccapurple: Float32Array.of(.4, .2, .6, 1),
						red: Float32Array.of(1, 0, 0, 1),
						rosybrown: Float32Array.of(.737, .561, .561, 1),
						royalblue: Float32Array.of(.255, .412, .882, 1),
						saddlebrown: Float32Array.of(.545, .271, .075, 1),
						salmon: Float32Array.of(.98, .502, .447, 1),
						sandybrown: Float32Array.of(.957, .643, .376, 1),
						seagreen: Float32Array.of(.18, .545, .341, 1),
						seashell: Float32Array.of(1, .961, .933, 1),
						sienna: Float32Array.of(.627, .322, .176, 1),
						silver: Float32Array.of(.753, .753, .753, 1),
						skyblue: Float32Array.of(.529, .808, .922, 1),
						slateblue: Float32Array.of(.416, .353, .804, 1),
						slategray: Float32Array.of(.439, .502, .565, 1),
						slategrey: Float32Array.of(.439, .502, .565, 1),
						snow: Float32Array.of(1, .98, .98, 1),
						springgreen: Float32Array.of(0, 1, .498, 1),
						steelblue: Float32Array.of(.275, .51, .706, 1),
						tan: Float32Array.of(.824, .706, .549, 1),
						teal: Float32Array.of(0, .502, .502, 1),
						thistle: Float32Array.of(.847, .749, .847, 1),
						tomato: Float32Array.of(1, .388, .278, 1),
						transparent: Float32Array.of(0, 0, 0, 0),
						turquoise: Float32Array.of(.251, .878, .816, 1),
						violet: Float32Array.of(.933, .51, .933, 1),
						wheat: Float32Array.of(.961, .871, .702, 1),
						white: Float32Array.of(1, 1, 1, 1),
						whitesmoke: Float32Array.of(.961, .961, .961, 1),
						yellow: Float32Array.of(1, 1, 0, 1),
						yellowgreen: Float32Array.of(.604, .804, .196, 1)
					};
					a._testing.parseColor = g;
					a._testing.colorToString = c;
					var wa = RegExp("(italic|oblique|normal|)\\s*(small-caps|normal|)\\s*(bold|bolder|lighter|[1-9]00|normal|)\\s*([\\d\\.]+)(px|pt|pc|in|cm|mm|%|em|ex|ch|rem|q)(.+)"), la;
					a._testing.parseFontString = l;
					a.MakeCanvas = function(E, k) {
						return (E = a.MakeSurface(E, k)) ? new A(E) : null;
					};
					a.ImageData = function() {
						if (2 === arguments.length) {
							var E = arguments[0], k = arguments[1];
							return new L(new Uint8ClampedArray(4 * E * k), E, k);
						}
						if (3 === arguments.length) {
							var p = arguments[0];
							if (p.prototype.constructor !== Uint8ClampedArray) throw new TypeError("bytes must be given as a Uint8ClampedArray");
							E = arguments[1];
							k = arguments[2];
							if (p % 4) throw new TypeError("bytes must be given in a multiple of 4");
							if (p % E) throw new TypeError("bytes must divide evenly by width");
							if (k && k !== p / (4 * E)) throw new TypeError("invalid height given");
							return new L(p, E, p / (4 * E));
						}
						throw new TypeError("invalid number of arguments - takes 2 or 3, saw " + arguments.length);
					};
				})();
			})(u);
			var Ca = "./this.program", Da = (a, b) => {
				throw b;
			}, Ea = "", Fa, Ga;
			if (pa) {
				var fs = require___vite_browser_external();
				require___vite_browser_external();
				Ea = __dirname + "/";
				Ga = (a) => {
					a = Ia(a) ? new URL(a) : a;
					return fs.readFileSync(a);
				};
				Fa = async (a) => {
					a = Ia(a) ? new URL(a) : a;
					return fs.readFileSync(a, void 0);
				};
				1 < process.argv.length && (Ca = process.argv[1].replace(/\\/g, "/"));
				process.argv.slice(2);
				Da = (a, b) => {
					process.exitCode = a;
					throw b;
				};
			} else if (na || oa) oa ? Ea = self.location.href : "undefined" != typeof document && document.currentScript && (Ea = document.currentScript.src), _scriptName && (Ea = _scriptName), Ea.startsWith("blob:") ? Ea = "" : Ea = Ea.slice(0, Ea.replace(/[?#].*/, "").lastIndexOf("/") + 1), oa && (Ga = (a) => {
				var b = new XMLHttpRequest();
				b.open("GET", a, !1);
				b.responseType = "arraybuffer";
				b.send(null);
				return new Uint8Array(b.response);
			}), Fa = async (a) => {
				if (Ia(a)) return new Promise((d, f) => {
					var h = new XMLHttpRequest();
					h.open("GET", a, !0);
					h.responseType = "arraybuffer";
					h.onload = () => {
						200 == h.status || 0 == h.status && h.response ? d(h.response) : f(h.status);
					};
					h.onerror = f;
					h.send(null);
				});
				var b = await fetch(a, { credentials: "same-origin" });
				if (b.ok) return b.arrayBuffer();
				throw Error(b.status + " : " + b.url);
			};
			var Ja = console.log.bind(console), Ka = console.error.bind(console), La, Oa = !1, Pa, Ra, Sa, Ta, N, O, R, Ua, Va, Wa, Ia = (a) => a.startsWith("file://");
			function Xa() {
				var a = La.buffer;
				Pa = new Int8Array(a);
				Sa = new Int16Array(a);
				u.HEAPU8 = Ra = new Uint8Array(a);
				u.HEAPU16 = Ta = new Uint16Array(a);
				u.HEAP32 = N = new Int32Array(a);
				u.HEAPU32 = O = new Uint32Array(a);
				u.HEAPF32 = R = new Float32Array(a);
				Wa = new Float64Array(a);
				Ua = new BigInt64Array(a);
				Va = new BigUint64Array(a);
			}
			var Ya = 0, bb = null;
			function cb(a) {
				a = "Aborted(" + a + ")";
				Ka(a);
				Oa = !0;
				a = new WebAssembly.RuntimeError(a + ". Build with -sASSERTIONS for more info.");
				ha(a);
				throw a;
			}
			var eb;
			async function fb(a) {
				try {
					var b = await Fa(a);
					return new Uint8Array(b);
				} catch {}
				if (Ga) a = Ga(a);
				else throw "both async and sync fetching of the wasm failed";
				return a;
			}
			async function gb(a, b) {
				try {
					var d = await fb(a);
					return await WebAssembly.instantiate(d, b);
				} catch (f) {
					Ka(`failed to asynchronously prepare wasm: ${f}`), cb(f);
				}
			}
			async function hb(a) {
				var b = eb;
				if ("function" == typeof WebAssembly.instantiateStreaming && !Ia(b) && !pa) try {
					var d = fetch(b, { credentials: "same-origin" });
					return await WebAssembly.instantiateStreaming(d, a);
				} catch (f) {
					Ka(`wasm streaming compile failed: ${f}`), Ka("falling back to ArrayBuffer instantiation");
				}
				return gb(b, a);
			}
			class ib {
				name = "ExitStatus";
				constructor(a) {
					this.message = `Program terminated with exit(${a})`;
					this.status = a;
				}
			}
			var jb = "undefined" != typeof TextDecoder ? new TextDecoder() : void 0, kb = (a, b = 0, d = NaN) => {
				var f = b + d;
				for (d = b; a[d] && !(d >= f);) ++d;
				if (16 < d - b && a.buffer && jb) return jb.decode(a.subarray(b, d));
				for (f = ""; b < d;) {
					var h = a[b++];
					if (h & 128) {
						var n = a[b++] & 63;
						if (192 == (h & 224)) f += String.fromCharCode((h & 31) << 6 | n);
						else {
							var v = a[b++] & 63;
							h = 224 == (h & 240) ? (h & 15) << 12 | n << 6 | v : (h & 7) << 18 | n << 12 | v << 6 | a[b++] & 63;
							65536 > h ? f += String.fromCharCode(h) : (h -= 65536, f += String.fromCharCode(55296 | h >> 10, 56320 | h & 1023));
						}
					} else f += String.fromCharCode(h);
				}
				return f;
			}, lb = {}, mb = (a) => {
				for (; a.length;) {
					var b = a.pop();
					a.pop()(b);
				}
			};
			function nb(a) {
				return this.fromWireType(O[a >> 2]);
			}
			var qb = {}, rb = {}, sb = {}, tb = u.InternalError = class extends Error {
				constructor(a) {
					super(a);
					this.name = "InternalError";
				}
			}, vb = (a, b, d) => {
				function f(m) {
					m = d(m);
					if (m.length !== a.length) throw new tb("Mismatched type converter count");
					for (var q = 0; q < a.length; ++q) ub(a[q], m[q]);
				}
				a.forEach((m) => sb[m] = b);
				var h = Array(b.length), n = [], v = 0;
				b.forEach((m, q) => {
					rb.hasOwnProperty(m) ? h[q] = rb[m] : (n.push(m), qb.hasOwnProperty(m) || (qb[m] = []), qb[m].push(() => {
						h[q] = rb[m];
						++v;
						v === n.length && f(h);
					}));
				});
				0 === n.length && f(h);
			}, wb = (a) => {
				if (null === a) return "null";
				var b = typeof a;
				return "object" === b || "array" === b || "function" === b ? a.toString() : "" + a;
			}, xb, yb = (a) => {
				for (var b = ""; Ra[a];) b += xb[Ra[a++]];
				return b;
			}, T = u.BindingError = class extends Error {
				constructor(a) {
					super(a);
					this.name = "BindingError";
				}
			};
			function zb(a, b, d = {}) {
				var f = b.name;
				if (!a) throw new T(`type "${f}" must have a positive integer typeid pointer`);
				if (rb.hasOwnProperty(a)) {
					if (d.Hf) return;
					throw new T(`Cannot register type '${f}' twice`);
				}
				rb[a] = b;
				delete sb[a];
				qb.hasOwnProperty(a) && (b = qb[a], delete qb[a], b.forEach((h) => h()));
			}
			function ub(a, b, d = {}) {
				return zb(a, b, d);
			}
			var Ab = (a, b, d) => {
				switch (b) {
					case 1: return d ? (f) => Pa[f] : (f) => Ra[f];
					case 2: return d ? (f) => Sa[f >> 1] : (f) => Ta[f >> 1];
					case 4: return d ? (f) => N[f >> 2] : (f) => O[f >> 2];
					case 8: return d ? (f) => Ua[f >> 3] : (f) => Va[f >> 3];
					default: throw new TypeError(`invalid integer width (${b}): ${a}`);
				}
			}, Bb = (a) => {
				throw new T(a.Fd.Qd.Ld.name + " instance already deleted");
			}, Cb = !1, Db = () => {}, Eb = (a) => {
				if ("undefined" === typeof FinalizationRegistry) return Eb = (b) => b, a;
				Cb = new FinalizationRegistry((b) => {
					b = b.Fd;
					--b.count.value;
					0 === b.count.value && (b.Rd ? b.ae.fe(b.Rd) : b.Qd.Ld.fe(b.Md));
				});
				Eb = (b) => {
					var d = b.Fd;
					d.Rd && Cb.register(b, { Fd: d }, b);
					return b;
				};
				Db = (b) => {
					Cb.unregister(b);
				};
				return Eb(a);
			}, Fb = [];
			function Gb() {}
			var Hb = (a, b) => Object.defineProperty(b, "name", { value: a }), Ib = {}, Jb = (a, b, d) => {
				if (void 0 === a[b].Sd) {
					var f = a[b];
					a[b] = function(...h) {
						if (!a[b].Sd.hasOwnProperty(h.length)) throw new T(`Function '${d}' called with an invalid number of arguments (${h.length}) - expects one of (${a[b].Sd})!`);
						return a[b].Sd[h.length].apply(this, h);
					};
					a[b].Sd = [];
					a[b].Sd[f.ke] = f;
				}
			}, Kb = (a, b, d) => {
				if (u.hasOwnProperty(a)) {
					if (void 0 === d || void 0 !== u[a].Sd && void 0 !== u[a].Sd[d]) throw new T(`Cannot register public name '${a}' twice`);
					Jb(u, a, a);
					if (u[a].Sd.hasOwnProperty(d)) throw new T(`Cannot register multiple overloads of a function with the same number of arguments (${d})!`);
					u[a].Sd[d] = b;
				} else u[a] = b, u[a].ke = d;
			}, Lb = (a) => {
				a = a.replace(/[^a-zA-Z0-9_]/g, "$");
				var b = a.charCodeAt(0);
				return 48 <= b && 57 >= b ? `_${a}` : a;
			};
			function Sb(a, b, d, f, h, n, v, m) {
				this.name = a;
				this.constructor = b;
				this.ze = d;
				this.fe = f;
				this.Wd = h;
				this.Cf = n;
				this.Ie = v;
				this.xf = m;
				this.Nf = [];
			}
			var Tb = (a, b, d) => {
				for (; b !== d;) {
					if (!b.Ie) throw new T(`Expected null or instance of ${d.name}, got an instance of ${b.name}`);
					a = b.Ie(a);
					b = b.Wd;
				}
				return a;
			};
			function Ub(a, b) {
				if (null === b) {
					if (this.Ye) throw new T(`null is not a valid ${this.name}`);
					return 0;
				}
				if (!b.Fd) throw new T(`Cannot pass "${wb(b)}" as a ${this.name}`);
				if (!b.Fd.Md) throw new T(`Cannot pass deleted object as a pointer of type ${this.name}`);
				return Tb(b.Fd.Md, b.Fd.Qd.Ld, this.Ld);
			}
			function Vb(a, b) {
				if (null === b) {
					if (this.Ye) throw new T(`null is not a valid ${this.name}`);
					if (this.Pe) {
						var d = this.Ze();
						null !== a && a.push(this.fe, d);
						return d;
					}
					return 0;
				}
				if (!b || !b.Fd) throw new T(`Cannot pass "${wb(b)}" as a ${this.name}`);
				if (!b.Fd.Md) throw new T(`Cannot pass deleted object as a pointer of type ${this.name}`);
				if (!this.Oe && b.Fd.Qd.Oe) throw new T(`Cannot convert argument of type ${b.Fd.ae ? b.Fd.ae.name : b.Fd.Qd.name} to parameter type ${this.name}`);
				d = Tb(b.Fd.Md, b.Fd.Qd.Ld, this.Ld);
				if (this.Pe) {
					if (void 0 === b.Fd.Rd) throw new T("Passing raw pointer to smart pointer is illegal");
					switch (this.Sf) {
						case 0:
							if (b.Fd.ae === this) d = b.Fd.Rd;
							else throw new T(`Cannot convert argument of type ${b.Fd.ae ? b.Fd.ae.name : b.Fd.Qd.name} to parameter type ${this.name}`);
							break;
						case 1:
							d = b.Fd.Rd;
							break;
						case 2:
							if (b.Fd.ae === this) d = b.Fd.Rd;
							else {
								var f = b.clone();
								d = this.Of(d, Wb(() => f["delete"]()));
								null !== a && a.push(this.fe, d);
							}
							break;
						default: throw new T("Unsupporting sharing policy");
					}
				}
				return d;
			}
			function Xb(a, b) {
				if (null === b) {
					if (this.Ye) throw new T(`null is not a valid ${this.name}`);
					return 0;
				}
				if (!b.Fd) throw new T(`Cannot pass "${wb(b)}" as a ${this.name}`);
				if (!b.Fd.Md) throw new T(`Cannot pass deleted object as a pointer of type ${this.name}`);
				if (b.Fd.Qd.Oe) throw new T(`Cannot convert argument of type ${b.Fd.Qd.name} to parameter type ${this.name}`);
				return Tb(b.Fd.Md, b.Fd.Qd.Ld, this.Ld);
			}
			var Yb = (a, b, d) => {
				if (b === d) return a;
				if (void 0 === d.Wd) return null;
				a = Yb(a, b, d.Wd);
				return null === a ? null : d.xf(a);
			}, Zb = {}, $b = (a, b) => {
				if (void 0 === b) throw new T("ptr should not be undefined");
				for (; a.Wd;) b = a.Ie(b), a = a.Wd;
				return Zb[b];
			}, ac = (a, b) => {
				if (!b.Qd || !b.Md) throw new tb("makeClassHandle requires ptr and ptrType");
				if (!!b.ae !== !!b.Rd) throw new tb("Both smartPtrType and smartPtr must be specified");
				b.count = { value: 1 };
				return Eb(Object.create(a, { Fd: {
					value: b,
					writable: !0
				} }));
			};
			function bc(a, b, d, f, h, n, v, m, q, w, D) {
				this.name = a;
				this.Ld = b;
				this.Ye = d;
				this.Oe = f;
				this.Pe = h;
				this.Mf = n;
				this.Sf = v;
				this.jf = m;
				this.Ze = q;
				this.Of = w;
				this.fe = D;
				h || void 0 !== b.Wd ? this.toWireType = Vb : (this.toWireType = f ? Ub : Xb, this.$d = null);
			}
			var cc = (a, b, d) => {
				if (!u.hasOwnProperty(a)) throw new tb("Replacing nonexistent public symbol");
				void 0 !== u[a].Sd && void 0 !== d ? u[a].Sd[d] = b : (u[a] = b, u[a].ke = d);
			}, dc, ec = (a, b) => {
				a = yb(a);
				var d = dc.get(b);
				if ("function" != typeof d) throw new T(`unknown function pointer with signature ${a}: ${b}`);
				return d;
			};
			class fc extends Error {}
			var ic = (a) => {
				a = gc(a);
				var b = yb(a);
				hc(a);
				return b;
			}, jc = (a, b) => {
				function d(n) {
					h[n] || rb[n] || (sb[n] ? sb[n].forEach(d) : (f.push(n), h[n] = !0));
				}
				var f = [], h = {};
				b.forEach(d);
				throw new fc(`${a}: ` + f.map(ic).join([", "]));
			};
			function kc(a) {
				for (var b = 1; b < a.length; ++b) if (null !== a[b] && void 0 === a[b].$d) return !0;
				return !1;
			}
			function lc(a, b, d, f, h) {
				var n = b.length;
				if (2 > n) throw new T("argTypes array size mismatch! Must at least get return value and 'this' types!");
				var v = null !== b[1] && null !== d, m = kc(b), q = "void" !== b[0].name, w = n - 2, D = Array(w), G = [], K = [];
				return Hb(a, function(...Y) {
					K.length = 0;
					G.length = v ? 2 : 1;
					G[0] = h;
					if (v) {
						var ea = b[1].toWireType(K, this);
						G[1] = ea;
					}
					for (var fa = 0; fa < w; ++fa) D[fa] = b[fa + 2].toWireType(K, Y[fa]), G.push(D[fa]);
					Y = f(...G);
					if (m) mb(K);
					else for (fa = v ? 1 : 2; fa < b.length; fa++) {
						var S = 1 === fa ? ea : D[fa - 2];
						null !== b[fa].$d && b[fa].$d(S);
					}
					ea = q ? b[0].fromWireType(Y) : void 0;
					return ea;
				});
			}
			for (var mc = (a, b) => {
				for (var d = [], f = 0; f < a; f++) d.push(O[b + 4 * f >> 2]);
				return d;
			}, tc = (a) => {
				a = a.trim();
				const b = a.indexOf("(");
				return -1 === b ? a : a.slice(0, b);
			}, uc = [], vc = [], wc = (a) => {
				9 < a && 0 === --vc[a + 1] && (vc[a] = void 0, uc.push(a));
			}, xc = (a) => {
				if (!a) throw new T(`Cannot use deleted val. handle = ${a}`);
				return vc[a];
			}, Wb = (a) => {
				switch (a) {
					case void 0: return 2;
					case null: return 4;
					case !0: return 6;
					case !1: return 8;
					default:
						const b = uc.pop() || vc.length;
						vc[b] = a;
						vc[b + 1] = 1;
						return b;
				}
			}, yc = {
				name: "emscripten::val",
				fromWireType: (a) => {
					var b = xc(a);
					wc(a);
					return b;
				},
				toWireType: (a, b) => Wb(b),
				Yd: 8,
				readValueFromPointer: nb,
				$d: null
			}, zc = (a, b, d) => {
				switch (b) {
					case 1: return d ? function(f) {
						return this.fromWireType(Pa[f]);
					} : function(f) {
						return this.fromWireType(Ra[f]);
					};
					case 2: return d ? function(f) {
						return this.fromWireType(Sa[f >> 1]);
					} : function(f) {
						return this.fromWireType(Ta[f >> 1]);
					};
					case 4: return d ? function(f) {
						return this.fromWireType(N[f >> 2]);
					} : function(f) {
						return this.fromWireType(O[f >> 2]);
					};
					default: throw new TypeError(`invalid integer width (${b}): ${a}`);
				}
			}, Ac = (a, b) => {
				var d = rb[a];
				if (void 0 === d) throw a = `${b} has unknown type ${ic(a)}`, new T(a);
				return d;
			}, Bc = (a, b) => {
				switch (b) {
					case 4: return function(d) {
						return this.fromWireType(R[d >> 2]);
					};
					case 8: return function(d) {
						return this.fromWireType(Wa[d >> 3]);
					};
					default: throw new TypeError(`invalid float width (${b}): ${a}`);
				}
			}, Ba = (a, b, d) => {
				var f = Ra;
				if (!(0 < d)) return 0;
				var h = b;
				d = b + d - 1;
				for (var n = 0; n < a.length; ++n) {
					var v = a.charCodeAt(n);
					if (55296 <= v && 57343 >= v) {
						var m = a.charCodeAt(++n);
						v = 65536 + ((v & 1023) << 10) | m & 1023;
					}
					if (127 >= v) {
						if (b >= d) break;
						f[b++] = v;
					} else {
						if (2047 >= v) {
							if (b + 1 >= d) break;
							f[b++] = 192 | v >> 6;
						} else {
							if (65535 >= v) {
								if (b + 2 >= d) break;
								f[b++] = 224 | v >> 12;
							} else {
								if (b + 3 >= d) break;
								f[b++] = 240 | v >> 18;
								f[b++] = 128 | v >> 12 & 63;
							}
							f[b++] = 128 | v >> 6 & 63;
						}
						f[b++] = 128 | v & 63;
					}
				}
				f[b] = 0;
				return b - h;
			}, Aa = (a) => {
				for (var b = 0, d = 0; d < a.length; ++d) {
					var f = a.charCodeAt(d);
					127 >= f ? b++ : 2047 >= f ? b += 2 : 55296 <= f && 57343 >= f ? (b += 4, ++d) : b += 3;
				}
				return b;
			}, Cc = "undefined" != typeof TextDecoder ? new TextDecoder("utf-16le") : void 0, Dc = (a, b) => {
				var d = a >> 1;
				for (var f = d + b / 2; !(d >= f) && Ta[d];) ++d;
				d <<= 1;
				if (32 < d - a && Cc) return Cc.decode(Ra.subarray(a, d));
				d = "";
				for (f = 0; !(f >= b / 2); ++f) {
					var h = Sa[a + 2 * f >> 1];
					if (0 == h) break;
					d += String.fromCharCode(h);
				}
				return d;
			}, Ec = (a, b, d) => {
				d ??= 2147483647;
				if (2 > d) return 0;
				d -= 2;
				var f = b;
				d = d < 2 * a.length ? d / 2 : a.length;
				for (var h = 0; h < d; ++h) Sa[b >> 1] = a.charCodeAt(h), b += 2;
				Sa[b >> 1] = 0;
				return b - f;
			}, Fc = (a) => 2 * a.length, Gc = (a, b) => {
				for (var d = 0, f = ""; !(d >= b / 4);) {
					var h = N[a + 4 * d >> 2];
					if (0 == h) break;
					++d;
					65536 <= h ? (h -= 65536, f += String.fromCharCode(55296 | h >> 10, 56320 | h & 1023)) : f += String.fromCharCode(h);
				}
				return f;
			}, Hc = (a, b, d) => {
				d ??= 2147483647;
				if (4 > d) return 0;
				var f = b;
				d = f + d - 4;
				for (var h = 0; h < a.length; ++h) {
					var n = a.charCodeAt(h);
					if (55296 <= n && 57343 >= n) {
						var v = a.charCodeAt(++h);
						n = 65536 + ((n & 1023) << 10) | v & 1023;
					}
					N[b >> 2] = n;
					b += 4;
					if (b + 4 > d) break;
				}
				N[b >> 2] = 0;
				return b - f;
			}, Ic = (a) => {
				for (var b = 0, d = 0; d < a.length; ++d) {
					var f = a.charCodeAt(d);
					55296 <= f && 57343 >= f && ++d;
					b += 4;
				}
				return b;
			}, Jc = (a, b, d) => {
				var f = [];
				a = a.toWireType(f, d);
				f.length && (O[b >> 2] = Wb(f));
				return a;
			}, Kc = [], Lc = {}, Mc = (a) => {
				var b = Lc[a];
				return void 0 === b ? yb(a) : b;
			}, Nc = () => {
				function a(b) {
					b.$$$embind_global$$$ = b;
					var d = "object" == typeof $$$embind_global$$$ && b.$$$embind_global$$$ == b;
					d || delete b.$$$embind_global$$$;
					return d;
				}
				if ("object" == typeof globalThis) return globalThis;
				if ("object" == typeof $$$embind_global$$$) return $$$embind_global$$$;
				"object" == typeof global && a(global) ? $$$embind_global$$$ = global : "object" == typeof self && a(self) && ($$$embind_global$$$ = self);
				if ("object" == typeof $$$embind_global$$$) return $$$embind_global$$$;
				throw Error("unable to get global object.");
			}, Oc = (a) => {
				var b = Kc.length;
				Kc.push(a);
				return b;
			}, Pc = (a, b) => {
				for (var d = Array(a), f = 0; f < a; ++f) d[f] = Ac(O[b + 4 * f >> 2], `parameter ${f}`);
				return d;
			}, Qc = Reflect.construct, U, Rc = (a) => {
				var b = a.getExtension("ANGLE_instanced_arrays");
				b && (a.vertexAttribDivisor = (d, f) => b.vertexAttribDivisorANGLE(d, f), a.drawArraysInstanced = (d, f, h, n) => b.drawArraysInstancedANGLE(d, f, h, n), a.drawElementsInstanced = (d, f, h, n, v) => b.drawElementsInstancedANGLE(d, f, h, n, v));
			}, Sc = (a) => {
				var b = a.getExtension("OES_vertex_array_object");
				b && (a.createVertexArray = () => b.createVertexArrayOES(), a.deleteVertexArray = (d) => b.deleteVertexArrayOES(d), a.bindVertexArray = (d) => b.bindVertexArrayOES(d), a.isVertexArray = (d) => b.isVertexArrayOES(d));
			}, Tc = (a) => {
				var b = a.getExtension("WEBGL_draw_buffers");
				b && (a.drawBuffers = (d, f) => b.drawBuffersWEBGL(d, f));
			}, Uc = (a) => {
				var b = "ANGLE_instanced_arrays EXT_blend_minmax EXT_disjoint_timer_query EXT_frag_depth EXT_shader_texture_lod EXT_sRGB OES_element_index_uint OES_fbo_render_mipmap OES_standard_derivatives OES_texture_float OES_texture_half_float OES_texture_half_float_linear OES_vertex_array_object WEBGL_color_buffer_float WEBGL_depth_texture WEBGL_draw_buffers EXT_color_buffer_float EXT_conservative_depth EXT_disjoint_timer_query_webgl2 EXT_texture_norm16 NV_shader_noperspective_interpolation WEBGL_clip_cull_distance EXT_clip_control EXT_color_buffer_half_float EXT_depth_clamp EXT_float_blend EXT_polygon_offset_clamp EXT_texture_compression_bptc EXT_texture_compression_rgtc EXT_texture_filter_anisotropic KHR_parallel_shader_compile OES_texture_float_linear WEBGL_blend_func_extended WEBGL_compressed_texture_astc WEBGL_compressed_texture_etc WEBGL_compressed_texture_etc1 WEBGL_compressed_texture_s3tc WEBGL_compressed_texture_s3tc_srgb WEBGL_debug_renderer_info WEBGL_debug_shaders WEBGL_lose_context WEBGL_multi_draw WEBGL_polygon_mode".split(" ");
				return (a.getSupportedExtensions() || []).filter((d) => b.includes(d));
			}, Vc = 1, Wc = [], Xc = [], Yc = [], Zc = [], ra = [], $c = [], ad = [], za = [], bd = [], cd = [], dd = [], ed = {}, fd = {}, gd = 4, hd = 0, qa = (a) => {
				for (var b = Vc++, d = a.length; d < b; d++) a[d] = null;
				return b;
			}, ld = (a, b, d, f) => {
				for (var h = 0; h < a; h++) {
					var n = U[d](), v = n && qa(f);
					n ? (n.name = v, f[v] = n) : W ||= 1282;
					N[b + 4 * h >> 2] = v;
				}
			}, sa = (a, b) => {
				a.af || (a.af = a.getContext, a.getContext = function(f, h) {
					h = a.af(f, h);
					return "webgl" == f == h instanceof WebGLRenderingContext ? h : null;
				});
				var d = 1 < b.majorVersion ? a.getContext("webgl2", b) : a.getContext("webgl", b);
				return d ? md(d, b) : 0;
			}, md = (a, b) => {
				var d = qa(za), f = {
					handle: d,
					attributes: b,
					version: b.majorVersion,
					ce: a
				};
				a.canvas && (a.canvas.mf = f);
				za[d] = f;
				("undefined" == typeof b.yf || b.yf) && nd(f);
				return d;
			}, ta = (a) => {
				I = za[a];
				u.ctx = U = I?.ce;
				return !(a && !U);
			}, nd = (a) => {
				a ||= I;
				if (!a.If) {
					a.If = !0;
					var b = a.ce;
					b.ag = b.getExtension("WEBGL_multi_draw");
					b.Zf = b.getExtension("EXT_polygon_offset_clamp");
					b.Yf = b.getExtension("EXT_clip_control");
					b.cg = b.getExtension("WEBGL_polygon_mode");
					Rc(b);
					Sc(b);
					Tc(b);
					b.ef = b.getExtension("WEBGL_draw_instanced_base_vertex_base_instance");
					b.hf = b.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance");
					2 <= a.version && (b.ee = b.getExtension("EXT_disjoint_timer_query_webgl2"));
					if (2 > a.version || !b.ee) b.ee = b.getExtension("EXT_disjoint_timer_query");
					Uc(b).forEach((d) => {
						d.includes("lose_context") || d.includes("debug") || b.getExtension(d);
					});
				}
			}, I, W, od = (a, b) => {
				U.bindFramebuffer(a, Yc[b]);
			}, pd = (a) => {
				U.bindVertexArray(ad[a]);
			}, qd = (a) => U.clear(a), rd = (a, b, d, f) => U.clearColor(a, b, d, f), sd = (a) => U.clearStencil(a), td = (a, b) => {
				for (var d = 0; d < a; d++) {
					var f = N[b + 4 * d >> 2];
					U.deleteVertexArray(ad[f]);
					ad[f] = null;
				}
			}, ud = [], vd = (a, b) => {
				ld(a, b, "createVertexArray", ad);
			}, wd = () => {
				var a = Uc(U);
				return a = a.concat(a.map((b) => "GL_" + b));
			}, xd = (a, b, d) => {
				if (b) {
					var f = void 0;
					switch (a) {
						case 36346:
							f = 1;
							break;
						case 36344:
							0 != d && 1 != d && (W ||= 1280);
							return;
						case 34814:
						case 36345:
							f = 0;
							break;
						case 34466:
							var h = U.getParameter(34467);
							f = h ? h.length : 0;
							break;
						case 33309:
							if (2 > I.version) {
								W ||= 1282;
								return;
							}
							f = wd().length;
							break;
						case 33307:
						case 33308:
							if (2 > I.version) {
								W ||= 1280;
								return;
							}
							f = 33307 == a ? 3 : 0;
					}
					if (void 0 === f) switch (h = U.getParameter(a), typeof h) {
						case "number":
							f = h;
							break;
						case "boolean":
							f = h ? 1 : 0;
							break;
						case "string":
							W ||= 1280;
							return;
						case "object":
							if (null === h) switch (a) {
								case 34964:
								case 35725:
								case 34965:
								case 36006:
								case 36007:
								case 32873:
								case 34229:
								case 36662:
								case 36663:
								case 35053:
								case 35055:
								case 36010:
								case 35097:
								case 35869:
								case 32874:
								case 36389:
								case 35983:
								case 35368:
								case 34068:
									f = 0;
									break;
								default:
									W ||= 1280;
									return;
							}
							else {
								if (h instanceof Float32Array || h instanceof Uint32Array || h instanceof Int32Array || h instanceof Array) {
									for (a = 0; a < h.length; ++a) switch (d) {
										case 0:
											N[b + 4 * a >> 2] = h[a];
											break;
										case 2:
											R[b + 4 * a >> 2] = h[a];
											break;
										case 4: Pa[b + a] = h[a] ? 1 : 0;
									}
									return;
								}
								try {
									f = h.name | 0;
								} catch (n) {
									W ||= 1280;
									Ka(`GL_INVALID_ENUM in glGet${d}v: Unknown object returned from WebGL getParameter(${a})! (error: ${n})`);
									return;
								}
							}
							break;
						default:
							W ||= 1280;
							Ka(`GL_INVALID_ENUM in glGet${d}v: Native code calling glGet${d}v(${a}) and it returns ${h} of type ${typeof h}!`);
							return;
					}
					switch (d) {
						case 1:
							d = f;
							O[b >> 2] = d;
							O[b + 4 >> 2] = (d - O[b >> 2]) / 4294967296;
							break;
						case 0:
							N[b >> 2] = f;
							break;
						case 2:
							R[b >> 2] = f;
							break;
						case 4: Pa[b] = f ? 1 : 0;
					}
				} else W ||= 1281;
			}, yd = (a, b) => xd(a, b, 0), zd = (a, b, d) => {
				if (d) {
					a = bd[a];
					b = 2 > I.version ? U.ee.getQueryObjectEXT(a, b) : U.getQueryParameter(a, b);
					var f;
					"boolean" == typeof b ? f = b ? 1 : 0 : f = b;
					O[d >> 2] = f;
					O[d + 4 >> 2] = (f - O[d >> 2]) / 4294967296;
				} else W ||= 1281;
			}, Bd = (a) => {
				var b = Aa(a) + 1, d = Ad(b);
				d && Ba(a, d, b);
				return d;
			}, Cd = (a) => {
				var b = ed[a];
				if (!b) {
					switch (a) {
						case 7939:
							b = Bd(wd().join(" "));
							break;
						case 7936:
						case 7937:
						case 37445:
						case 37446:
							(b = U.getParameter(a)) || (W ||= 1280);
							b = b ? Bd(b) : 0;
							break;
						case 7938:
							b = U.getParameter(7938);
							var d = `OpenGL ES 2.0 (${b})`;
							2 <= I.version && (d = `OpenGL ES 3.0 (${b})`);
							b = Bd(d);
							break;
						case 35724:
							b = U.getParameter(35724);
							d = b.match(/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/);
							null !== d && (3 == d[1].length && (d[1] += "0"), b = `OpenGL ES GLSL ES ${d[1]} (${b})`);
							b = Bd(b);
							break;
						default: W ||= 1280;
					}
					ed[a] = b;
				}
				return b;
			}, Dd = (a, b) => {
				if (2 > I.version) return W ||= 1282, 0;
				var d = fd[a];
				if (d) return 0 > b || b >= d.length ? (W ||= 1281, 0) : d[b];
				switch (a) {
					case 7939: return d = wd().map(Bd), d = fd[a] = d, 0 > b || b >= d.length ? (W ||= 1281, 0) : d[b];
					default: return W ||= 1280, 0;
				}
			}, Ed = (a) => "]" == a.slice(-1) && a.lastIndexOf("["), Fd = (a) => {
				a -= 5120;
				return 0 == a ? Pa : 1 == a ? Ra : 2 == a ? Sa : 4 == a ? N : 6 == a ? R : 5 == a || 28922 == a || 28520 == a || 30779 == a || 30782 == a ? O : Ta;
			}, Gd = (a, b, d, f, h) => {
				a = Fd(a);
				b = f * ((hd || d) * ({
					5: 3,
					6: 4,
					8: 2,
					29502: 3,
					29504: 4,
					26917: 2,
					26918: 2,
					29846: 3,
					29847: 4
				}[b - 6402] || 1) * a.BYTES_PER_ELEMENT + gd - 1 & -gd);
				return a.subarray(h >>> 31 - Math.clz32(a.BYTES_PER_ELEMENT), h + b >>> 31 - Math.clz32(a.BYTES_PER_ELEMENT));
			}, Z = (a) => {
				var b = U.wf;
				if (b) {
					var d = b.He[a];
					"number" == typeof d && (b.He[a] = d = U.getUniformLocation(b, b.kf[a] + (0 < d ? `[${d}]` : "")));
					return d;
				}
				W ||= 1282;
			}, Hd = [], Id = [], Jd = {}, Ld = () => {
				if (!Kd) {
					var a = {
						USER: "web_user",
						LOGNAME: "web_user",
						PATH: "/",
						PWD: "/",
						HOME: "/home/web_user",
						LANG: ("object" == typeof navigator && navigator.languages && navigator.languages[0] || "C").replace("-", "_") + ".UTF-8",
						_: Ca || "./this.program"
					}, b;
					for (b in Jd) void 0 === Jd[b] ? delete a[b] : a[b] = Jd[b];
					var d = [];
					for (b in a) d.push(`${b}=${a[b]}`);
					Kd = d;
				}
				return Kd;
			}, Kd, Md = [
				null,
				[],
				[]
			], Nd = Array(256), Od = 0; 256 > Od; ++Od) Nd[Od] = String.fromCharCode(Od);
			xb = Nd;
			(() => {
				let a = Gb.prototype;
				Object.assign(a, {
					isAliasOf: function(d) {
						if (!(this instanceof Gb && d instanceof Gb)) return !1;
						var f = this.Fd.Qd.Ld, h = this.Fd.Md;
						d.Fd = d.Fd;
						var n = d.Fd.Qd.Ld;
						for (d = d.Fd.Md; f.Wd;) h = f.Ie(h), f = f.Wd;
						for (; n.Wd;) d = n.Ie(d), n = n.Wd;
						return f === n && h === d;
					},
					clone: function() {
						this.Fd.Md || Bb(this);
						if (this.Fd.Ge) return this.Fd.count.value += 1, this;
						var d = Eb, f = Object, h = f.create, n = Object.getPrototypeOf(this), v = this.Fd;
						d = d(h.call(f, n, { Fd: { value: {
							count: v.count,
							Fe: v.Fe,
							Ge: v.Ge,
							Md: v.Md,
							Qd: v.Qd,
							Rd: v.Rd,
							ae: v.ae
						} } }));
						d.Fd.count.value += 1;
						d.Fd.Fe = !1;
						return d;
					},
					["delete"]() {
						this.Fd.Md || Bb(this);
						if (this.Fd.Fe && !this.Fd.Ge) throw new T("Object already scheduled for deletion");
						Db(this);
						var d = this.Fd;
						--d.count.value;
						0 === d.count.value && (d.Rd ? d.ae.fe(d.Rd) : d.Qd.Ld.fe(d.Md));
						this.Fd.Ge || (this.Fd.Rd = void 0, this.Fd.Md = void 0);
					},
					isDeleted: function() {
						return !this.Fd.Md;
					},
					deleteLater: function() {
						this.Fd.Md || Bb(this);
						if (this.Fd.Fe && !this.Fd.Ge) throw new T("Object already scheduled for deletion");
						Fb.push(this);
						this.Fd.Fe = !0;
						return this;
					}
				});
				const b = Symbol.dispose;
				b && (a[b] = a["delete"]);
			})();
			Object.assign(bc.prototype, {
				Df(a) {
					this.jf && (a = this.jf(a));
					return a;
				},
				df(a) {
					this.fe?.(a);
				},
				Yd: 8,
				readValueFromPointer: nb,
				fromWireType: function(a) {
					function b() {
						return this.Pe ? ac(this.Ld.ze, {
							Qd: this.Mf,
							Md: d,
							ae: this,
							Rd: a
						}) : ac(this.Ld.ze, {
							Qd: this,
							Md: a
						});
					}
					var d = this.Df(a);
					if (!d) return this.df(a), null;
					var f = $b(this.Ld, d);
					if (void 0 !== f) {
						if (0 === f.Fd.count.value) return f.Fd.Md = d, f.Fd.Rd = a, f.clone();
						f = f.clone();
						this.df(a);
						return f;
					}
					f = this.Ld.Cf(d);
					f = Ib[f];
					if (!f) return b.call(this);
					f = this.Oe ? f.uf : f.pointerType;
					var h = Yb(d, this.Ld, f.Ld);
					return null === h ? b.call(this) : this.Pe ? ac(f.Ld.ze, {
						Qd: f,
						Md: h,
						ae: this,
						Rd: a
					}) : ac(f.Ld.ze, {
						Qd: f,
						Md: h
					});
				}
			});
			vc.push(0, 1, void 0, 1, null, 1, !0, 1, !1, 1);
			u.count_emval_handles = () => vc.length / 2 - 5 - uc.length;
			for (let a = 0; 32 > a; ++a) ud.push(Array(a));
			for (var Pd = /* @__PURE__ */ new Float32Array(288), Qd = 0; 288 >= Qd; ++Qd) Hd[Qd] = Pd.subarray(0, Qd);
			var Rd = /* @__PURE__ */ new Int32Array(288);
			for (Qd = 0; 288 >= Qd; ++Qd) Id[Qd] = Rd.subarray(0, Qd);
			var he = {
				S: function() {
					return 0;
				},
				hb: () => {},
				jb: function() {
					return 0;
				},
				eb: () => {},
				fb: () => {},
				T: function() {},
				gb: () => {},
				kb: () => cb(""),
				A: (a) => {
					var b = lb[a];
					delete lb[a];
					var d = b.Ze, f = b.fe, h = b.ff, n = h.map((v) => v.Gf).concat(h.map((v) => v.Qf));
					vb([a], n, (v) => {
						var m = {};
						h.forEach((q, w) => {
							var D = v[w], G = q.Ef, K = q.Ff, Y = v[w + h.length], ea = q.Pf, fa = q.Rf;
							m[q.zf] = {
								read: (S) => D.fromWireType(G(K, S)),
								write: (S, ya) => {
									var ma = [];
									ea(fa, S, Y.toWireType(ma, ya));
									mb(ma);
								},
								optional: v[w].optional
							};
						});
						return [{
							name: b.name,
							fromWireType: (q) => {
								var w = {}, D;
								for (D in m) w[D] = m[D].read(q);
								f(q);
								return w;
							},
							toWireType: (q, w) => {
								for (var D in m) if (!(D in w || m[D].optional)) throw new TypeError(`Missing field: "${D}"`);
								var G = d();
								for (D in m) m[D].write(G, w[D]);
								null !== q && q.push(f, G);
								return G;
							},
							Yd: 8,
							readValueFromPointer: nb,
							$d: f
						}];
					});
				},
				Q: (a, b, d) => {
					b = yb(b);
					ub(a, {
						name: b,
						fromWireType: (f) => f,
						toWireType: function(f, h) {
							if ("bigint" != typeof h && "number" != typeof h) throw new TypeError(`Cannot convert "${wb(h)}" to ${this.name}`);
							"number" == typeof h && (h = BigInt(h));
							return h;
						},
						Yd: 8,
						readValueFromPointer: Ab(b, d, -1 == b.indexOf("u")),
						$d: null
					});
				},
				Ta: (a, b, d, f) => {
					b = yb(b);
					ub(a, {
						name: b,
						fromWireType: function(h) {
							return !!h;
						},
						toWireType: function(h, n) {
							return n ? d : f;
						},
						Yd: 8,
						readValueFromPointer: function(h) {
							return this.fromWireType(Ra[h]);
						},
						$d: null
					});
				},
				l: (a, b, d, f, h, n, v, m, q, w, D, G, K) => {
					D = yb(D);
					n = ec(h, n);
					m &&= ec(v, m);
					w &&= ec(q, w);
					K = ec(G, K);
					var Y = Lb(D);
					Kb(Y, function() {
						jc(`Cannot construct ${D} due to unbound types`, [f]);
					});
					vb([
						a,
						b,
						d
					], f ? [f] : [], (ea) => {
						ea = ea[0];
						if (f) {
							var fa = ea.Ld;
							var S = fa.ze;
						} else S = Gb.prototype;
						ea = Hb(D, function(...$a) {
							if (Object.getPrototypeOf(this) !== ya) throw new T(`Use 'new' to construct ${D}`);
							if (void 0 === ma.le) throw new T(`${D} has no accessible constructor`);
							var xa = ma.le[$a.length];
							if (void 0 === xa) throw new T(`Tried to invoke ctor of ${D} with invalid number of parameters (${$a.length}) - expected (${Object.keys(ma.le).toString()}) parameters instead!`);
							return xa.apply(this, $a);
						});
						var ya = Object.create(S, { constructor: { value: ea } });
						ea.prototype = ya;
						var ma = new Sb(D, ea, ya, K, fa, n, m, w);
						if (ma.Wd) {
							var Ma;
							(Ma = ma.Wd).Je ?? (Ma.Je = []);
							ma.Wd.Je.push(ma);
						}
						fa = new bc(D, ma, !0, !1, !1);
						Ma = new bc(D + "*", ma, !1, !1, !1);
						S = new bc(D + " const*", ma, !1, !0, !1);
						Ib[a] = {
							pointerType: Ma,
							uf: S
						};
						cc(Y, ea);
						return [
							fa,
							Ma,
							S
						];
					});
				},
				e: (a, b, d, f, h, n, v) => {
					var m = mc(d, f);
					b = yb(b);
					b = tc(b);
					n = ec(h, n);
					vb([], [a], (q) => {
						function w() {
							jc(`Cannot call ${D} due to unbound types`, m);
						}
						q = q[0];
						var D = `${q.name}.${b}`;
						b.startsWith("@@") && (b = Symbol[b.substring(2)]);
						var G = q.Ld.constructor;
						void 0 === G[b] ? (w.ke = d - 1, G[b] = w) : (Jb(G, b, D), G[b].Sd[d - 1] = w);
						vb([], m, (K) => {
							K = [K[0], null].concat(K.slice(1));
							K = lc(D, K, null, n, v);
							void 0 === G[b].Sd ? (K.ke = d - 1, G[b] = K) : G[b].Sd[d - 1] = K;
							if (q.Ld.Je) for (const Y of q.Ld.Je) Y.constructor.hasOwnProperty(b) || (Y.constructor[b] = K);
							return [];
						});
						return [];
					});
				},
				y: (a, b, d, f, h, n) => {
					var v = mc(b, d);
					h = ec(f, h);
					vb([], [a], (m) => {
						m = m[0];
						var q = `constructor ${m.name}`;
						void 0 === m.Ld.le && (m.Ld.le = []);
						if (void 0 !== m.Ld.le[b - 1]) throw new T(`Cannot register multiple constructors with identical number of parameters (${b - 1}) for class '${m.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
						m.Ld.le[b - 1] = () => {
							jc(`Cannot construct ${m.name} due to unbound types`, v);
						};
						vb([], v, (w) => {
							w.splice(1, 0, null);
							m.Ld.le[b - 1] = lc(q, w, null, h, n);
							return [];
						});
						return [];
					});
				},
				a: (a, b, d, f, h, n, v, m) => {
					var q = mc(d, f);
					b = yb(b);
					b = tc(b);
					n = ec(h, n);
					vb([], [a], (w) => {
						function D() {
							jc(`Cannot call ${G} due to unbound types`, q);
						}
						w = w[0];
						var G = `${w.name}.${b}`;
						b.startsWith("@@") && (b = Symbol[b.substring(2)]);
						m && w.Ld.Nf.push(b);
						var K = w.Ld.ze, Y = K[b];
						void 0 === Y || void 0 === Y.Sd && Y.className !== w.name && Y.ke === d - 2 ? (D.ke = d - 2, D.className = w.name, K[b] = D) : (Jb(K, b, G), K[b].Sd[d - 2] = D);
						vb([], q, (ea) => {
							ea = lc(G, ea, w, n, v);
							void 0 === K[b].Sd ? (ea.ke = d - 2, K[b] = ea) : K[b].Sd[d - 2] = ea;
							return [];
						});
						return [];
					});
				},
				u: (a, b, d) => {
					a = yb(a);
					vb([], [b], (f) => {
						f = f[0];
						u[a] = f.fromWireType(d);
						return [];
					});
				},
				Ra: (a) => ub(a, yc),
				k: (a, b, d, f) => {
					function h() {}
					b = yb(b);
					h.values = {};
					ub(a, {
						name: b,
						constructor: h,
						fromWireType: function(n) {
							return this.constructor.values[n];
						},
						toWireType: (n, v) => v.value,
						Yd: 8,
						readValueFromPointer: zc(b, d, f),
						$d: null
					});
					Kb(b, h);
				},
				b: (a, b, d) => {
					var f = Ac(a, "enum");
					b = yb(b);
					a = f.constructor;
					f = Object.create(f.constructor.prototype, {
						value: { value: d },
						constructor: { value: Hb(`${f.name}_${b}`, function() {}) }
					});
					a.values[d] = f;
					a[b] = f;
				},
				P: (a, b, d) => {
					b = yb(b);
					ub(a, {
						name: b,
						fromWireType: (f) => f,
						toWireType: (f, h) => h,
						Yd: 8,
						readValueFromPointer: Bc(b, d),
						$d: null
					});
				},
				x: (a, b, d, f, h, n) => {
					var v = mc(b, d);
					a = yb(a);
					a = tc(a);
					h = ec(f, h);
					Kb(a, function() {
						jc(`Cannot call ${a} due to unbound types`, v);
					}, b - 1);
					vb([], v, (m) => {
						m = [m[0], null].concat(m.slice(1));
						cc(a, lc(a, m, null, h, n), b - 1);
						return [];
					});
				},
				C: (a, b, d, f, h) => {
					b = yb(b);
					-1 === h && (h = 4294967295);
					h = (m) => m;
					if (0 === f) {
						var n = 32 - 8 * d;
						h = (m) => m << n >>> n;
					}
					var v = b.includes("unsigned") ? function(m, q) {
						return q >>> 0;
					} : function(m, q) {
						return q;
					};
					ub(a, {
						name: b,
						fromWireType: h,
						toWireType: v,
						Yd: 8,
						readValueFromPointer: Ab(b, d, 0 !== f),
						$d: null
					});
				},
				t: (a, b, d) => {
					function f(n) {
						return new h(Pa.buffer, O[n + 4 >> 2], O[n >> 2]);
					}
					var h = [
						Int8Array,
						Uint8Array,
						Int16Array,
						Uint16Array,
						Int32Array,
						Uint32Array,
						Float32Array,
						Float64Array,
						BigInt64Array,
						BigUint64Array
					][b];
					d = yb(d);
					ub(a, {
						name: d,
						fromWireType: f,
						Yd: 8,
						readValueFromPointer: f
					}, { Hf: !0 });
				},
				s: (a, b, d, f, h, n, v, m, q, w, D, G) => {
					d = yb(d);
					n = ec(h, n);
					m = ec(v, m);
					w = ec(q, w);
					G = ec(D, G);
					vb([a], [b], (K) => {
						K = K[0];
						return [new bc(d, K.Ld, !1, !1, !0, K, f, n, m, w, G)];
					});
				},
				Sa: (a, b) => {
					b = yb(b);
					ub(a, {
						name: b,
						fromWireType: function(d) {
							for (var f = O[d >> 2], h = d + 4, n, v = h, m = 0; m <= f; ++m) {
								var q = h + m;
								if (m == f || 0 == Ra[q]) v = v ? kb(Ra, v, q - v) : "", void 0 === n ? n = v : (n += String.fromCharCode(0), n += v), v = q + 1;
							}
							hc(d);
							return n;
						},
						toWireType: function(d, f) {
							f instanceof ArrayBuffer && (f = new Uint8Array(f));
							var h = "string" == typeof f;
							if (!(h || ArrayBuffer.isView(f) && 1 == f.BYTES_PER_ELEMENT)) throw new T("Cannot pass non-string to std::string");
							var n = h ? Aa(f) : f.length;
							var v = Ad(4 + n + 1), m = v + 4;
							O[v >> 2] = n;
							h ? Ba(f, m, n + 1) : Ra.set(f, m);
							null !== d && d.push(hc, v);
							return v;
						},
						Yd: 8,
						readValueFromPointer: nb,
						$d(d) {
							hc(d);
						}
					});
				},
				M: (a, b, d) => {
					d = yb(d);
					if (2 === b) {
						var f = Dc;
						var h = Ec;
						var n = Fc;
						var v = (m) => Ta[m >> 1];
					} else 4 === b && (f = Gc, h = Hc, n = Ic, v = (m) => O[m >> 2]);
					ub(a, {
						name: d,
						fromWireType: (m) => {
							for (var q = O[m >> 2], w, D = m + 4, G = 0; G <= q; ++G) {
								var K = m + 4 + G * b;
								if (G == q || 0 == v(K)) D = f(D, K - D), void 0 === w ? w = D : (w += String.fromCharCode(0), w += D), D = K + b;
							}
							hc(m);
							return w;
						},
						toWireType: (m, q) => {
							if ("string" != typeof q) throw new T(`Cannot pass non-string to C++ string type ${d}`);
							var w = n(q), D = Ad(4 + w + b);
							O[D >> 2] = w / b;
							h(q, D + 4, w + b);
							null !== m && m.push(hc, D);
							return D;
						},
						Yd: 8,
						readValueFromPointer: nb,
						$d(m) {
							hc(m);
						}
					});
				},
				B: (a, b, d, f, h, n) => {
					lb[a] = {
						name: yb(b),
						Ze: ec(d, f),
						fe: ec(h, n),
						ff: []
					};
				},
				d: (a, b, d, f, h, n, v, m, q, w) => {
					lb[a].ff.push({
						zf: yb(b),
						Gf: d,
						Ef: ec(f, h),
						Ff: n,
						Qf: v,
						Pf: ec(m, q),
						Rf: w
					});
				},
				Ua: (a, b) => {
					b = yb(b);
					ub(a, {
						$f: !0,
						name: b,
						Yd: 0,
						fromWireType: () => {},
						toWireType: () => {}
					});
				},
				Ya: () => {
					throw Infinity;
				},
				D: (a, b, d) => {
					a = xc(a);
					b = Ac(b, "emval::as");
					return Jc(b, d, a);
				},
				I: (a, b, d, f) => {
					a = Kc[a];
					b = xc(b);
					return a(null, b, d, f);
				},
				w: (a, b, d, f, h) => {
					a = Kc[a];
					b = xc(b);
					d = Mc(d);
					return a(b, b[d], f, h);
				},
				c: wc,
				J: (a) => {
					if (0 === a) return Wb(Nc());
					a = Mc(a);
					return Wb(Nc()[a]);
				},
				p: (a, b, d) => {
					var f = Pc(a, b), h = f.shift();
					a--;
					var n = Array(a);
					b = `methodCaller<(${f.map((v) => v.name).join(", ")}) => ${h.name}>`;
					return Oc(Hb(b, (v, m, q, w) => {
						for (var D = 0, G = 0; G < a; ++G) n[G] = f[G].readValueFromPointer(w + D), D += f[G].Yd;
						v = 1 === d ? Qc(m, n) : m.apply(v, n);
						return Jc(h, q, v);
					}));
				},
				z: (a, b) => {
					a = xc(a);
					b = xc(b);
					return Wb(a[b]);
				},
				G: (a) => {
					9 < a && (vc[a + 1] += 1);
				},
				F: () => Wb([]),
				f: (a) => Wb(Mc(a)),
				E: () => Wb({}),
				Qa: (a) => {
					a = xc(a);
					return !a;
				},
				m: (a) => {
					mb(xc(a));
					wc(a);
				},
				i: (a, b, d) => {
					a = xc(a);
					b = xc(b);
					d = xc(d);
					a[b] = d;
				},
				g: (a, b) => {
					a = Ac(a, "_emval_take_value");
					a = a.readValueFromPointer(b);
					return Wb(a);
				},
				$a: function() {
					return -52;
				},
				ab: function() {},
				lb: (a, b, d, f) => {
					var h = (/* @__PURE__ */ new Date()).getFullYear(), n = new Date(h, 0, 1).getTimezoneOffset();
					h = new Date(h, 6, 1).getTimezoneOffset();
					O[a >> 2] = 60 * Math.max(n, h);
					N[b >> 2] = Number(n != h);
					b = (v) => {
						var m = Math.abs(v);
						return `UTC${0 <= v ? "-" : "+"}${String(Math.floor(m / 60)).padStart(2, "0")}${String(m % 60).padStart(2, "0")}`;
					};
					a = b(n);
					b = b(h);
					h < n ? (Ba(a, d, 17), Ba(b, f, 17)) : (Ba(a, f, 17), Ba(b, d, 17));
				},
				Xa: function(a, b, d) {
					if (!(0 <= a && 3 >= a)) return 28;
					Ua[d >> 3] = BigInt(Math.round(1e6 * (0 === a ? Date.now() : performance.now())));
					return 0;
				},
				Xc: (a) => U.activeTexture(a),
				Yc: (a, b) => {
					U.attachShader(Xc[a], $c[b]);
				},
				Ab: (a, b) => {
					U.beginQuery(a, bd[b]);
				},
				ub: (a, b) => {
					U.ee.beginQueryEXT(a, bd[b]);
				},
				Zc: (a, b, d) => {
					U.bindAttribLocation(Xc[a], b, d ? kb(Ra, d) : "");
				},
				_c: (a, b) => {
					35051 == a ? U.We = b : 35052 == a && (U.ye = b);
					U.bindBuffer(a, Wc[b]);
				},
				Zb: od,
				_b: (a, b) => {
					U.bindRenderbuffer(a, Zc[b]);
				},
				Hb: (a, b) => {
					U.bindSampler(a, cd[b]);
				},
				$c: (a, b) => {
					U.bindTexture(a, ra[b]);
				},
				tc: pd,
				wc: pd,
				ad: (a, b, d, f) => U.blendColor(a, b, d, f),
				bd: (a) => U.blendEquation(a),
				cd: (a, b) => U.blendFunc(a, b),
				Tb: (a, b, d, f, h, n, v, m, q, w) => U.blitFramebuffer(a, b, d, f, h, n, v, m, q, w),
				dd: (a, b, d, f) => {
					2 <= I.version ? d && b ? U.bufferData(a, Ra, f, d, b) : U.bufferData(a, b, f) : U.bufferData(a, d ? Ra.subarray(d, d + b) : b, f);
				},
				ed: (a, b, d, f) => {
					2 <= I.version ? d && U.bufferSubData(a, b, Ra, f, d) : U.bufferSubData(a, b, Ra.subarray(f, f + d));
				},
				$b: (a) => U.checkFramebufferStatus(a),
				fd: qd,
				gd: rd,
				hd: sd,
				Qb: (a, b, d) => {
					d = Number(d);
					return U.clientWaitSync(dd[a], b, d);
				},
				id: (a, b, d, f) => {
					U.colorMask(!!a, !!b, !!d, !!f);
				},
				jd: (a) => {
					U.compileShader($c[a]);
				},
				kd: (a, b, d, f, h, n, v, m) => {
					2 <= I.version ? U.ye || !v ? U.compressedTexImage2D(a, b, d, f, h, n, v, m) : U.compressedTexImage2D(a, b, d, f, h, n, Ra, m, v) : U.compressedTexImage2D(a, b, d, f, h, n, Ra.subarray(m, m + v));
				},
				ld: (a, b, d, f, h, n, v, m, q) => {
					2 <= I.version ? U.ye || !m ? U.compressedTexSubImage2D(a, b, d, f, h, n, v, m, q) : U.compressedTexSubImage2D(a, b, d, f, h, n, v, Ra, q, m) : U.compressedTexSubImage2D(a, b, d, f, h, n, v, Ra.subarray(q, q + m));
				},
				Sb: (a, b, d, f, h) => U.copyBufferSubData(a, b, d, f, h),
				md: (a, b, d, f, h, n, v, m) => U.copyTexSubImage2D(a, b, d, f, h, n, v, m),
				nd: () => {
					var a = qa(Xc), b = U.createProgram();
					b.name = a;
					b.Se = b.Qe = b.Re = 0;
					b.$e = 1;
					Xc[a] = b;
					return a;
				},
				od: (a) => {
					var b = qa($c);
					$c[b] = U.createShader(a);
					return b;
				},
				pd: (a) => U.cullFace(a),
				qd: (a, b) => {
					for (var d = 0; d < a; d++) {
						var f = N[b + 4 * d >> 2], h = Wc[f];
						h && (U.deleteBuffer(h), h.name = 0, Wc[f] = null, f == U.We && (U.We = 0), f == U.ye && (U.ye = 0));
					}
				},
				ac: (a, b) => {
					for (var d = 0; d < a; ++d) {
						var f = N[b + 4 * d >> 2], h = Yc[f];
						h && (U.deleteFramebuffer(h), h.name = 0, Yc[f] = null);
					}
				},
				rd: (a) => {
					if (a) {
						var b = Xc[a];
						b ? (U.deleteProgram(b), b.name = 0, Xc[a] = null) : W ||= 1281;
					}
				},
				Cb: (a, b) => {
					for (var d = 0; d < a; d++) {
						var f = N[b + 4 * d >> 2], h = bd[f];
						h && (U.deleteQuery(h), bd[f] = null);
					}
				},
				vb: (a, b) => {
					for (var d = 0; d < a; d++) {
						var f = N[b + 4 * d >> 2], h = bd[f];
						h && (U.ee.deleteQueryEXT(h), bd[f] = null);
					}
				},
				bc: (a, b) => {
					for (var d = 0; d < a; d++) {
						var f = N[b + 4 * d >> 2], h = Zc[f];
						h && (U.deleteRenderbuffer(h), h.name = 0, Zc[f] = null);
					}
				},
				Ib: (a, b) => {
					for (var d = 0; d < a; d++) {
						var f = N[b + 4 * d >> 2], h = cd[f];
						h && (U.deleteSampler(h), h.name = 0, cd[f] = null);
					}
				},
				sd: (a) => {
					if (a) {
						var b = $c[a];
						b ? (U.deleteShader(b), $c[a] = null) : W ||= 1281;
					}
				},
				Rb: (a) => {
					if (a) {
						var b = dd[a];
						b ? (U.deleteSync(b), b.name = 0, dd[a] = null) : W ||= 1281;
					}
				},
				td: (a, b) => {
					for (var d = 0; d < a; d++) {
						var f = N[b + 4 * d >> 2], h = ra[f];
						h && (U.deleteTexture(h), h.name = 0, ra[f] = null);
					}
				},
				uc: td,
				xc: td,
				W: (a) => {
					U.depthMask(!!a);
				},
				X: (a) => U.disable(a),
				Y: (a) => {
					U.disableVertexAttribArray(a);
				},
				Z: (a, b, d) => {
					U.drawArrays(a, b, d);
				},
				rc: (a, b, d, f) => {
					U.drawArraysInstanced(a, b, d, f);
				},
				oc: (a, b, d, f, h) => {
					U.ef.drawArraysInstancedBaseInstanceWEBGL(a, b, d, f, h);
				},
				mc: (a, b) => {
					for (var d = ud[a], f = 0; f < a; f++) d[f] = N[b + 4 * f >> 2];
					U.drawBuffers(d);
				},
				_: (a, b, d, f) => {
					U.drawElements(a, b, d, f);
				},
				sc: (a, b, d, f, h) => {
					U.drawElementsInstanced(a, b, d, f, h);
				},
				pc: (a, b, d, f, h, n, v) => {
					U.ef.drawElementsInstancedBaseVertexBaseInstanceWEBGL(a, b, d, f, h, n, v);
				},
				gc: (a, b, d, f, h, n) => {
					U.drawElements(a, f, h, n);
				},
				$: (a) => U.enable(a),
				aa: (a) => {
					U.enableVertexAttribArray(a);
				},
				Db: (a) => U.endQuery(a),
				wb: (a) => {
					U.ee.endQueryEXT(a);
				},
				Nb: (a, b) => (a = U.fenceSync(a, b)) ? (b = qa(dd), a.name = b, dd[b] = a, b) : 0,
				ba: () => U.finish(),
				ca: () => U.flush(),
				cc: (a, b, d, f) => {
					U.framebufferRenderbuffer(a, b, d, Zc[f]);
				},
				dc: (a, b, d, f, h) => {
					U.framebufferTexture2D(a, b, d, ra[f], h);
				},
				da: (a) => U.frontFace(a),
				ea: (a, b) => {
					ld(a, b, "createBuffer", Wc);
				},
				ec: (a, b) => {
					ld(a, b, "createFramebuffer", Yc);
				},
				Eb: (a, b) => {
					ld(a, b, "createQuery", bd);
				},
				xb: (a, b) => {
					for (var d = 0; d < a; d++) {
						var f = U.ee.createQueryEXT();
						if (!f) {
							for (W ||= 1282; d < a;) N[b + 4 * d++ >> 2] = 0;
							break;
						}
						var h = qa(bd);
						f.name = h;
						bd[h] = f;
						N[b + 4 * d >> 2] = h;
					}
				},
				fc: (a, b) => {
					ld(a, b, "createRenderbuffer", Zc);
				},
				Jb: (a, b) => {
					ld(a, b, "createSampler", cd);
				},
				fa: (a, b) => {
					ld(a, b, "createTexture", ra);
				},
				qc: vd,
				yc: vd,
				Vb: (a) => U.generateMipmap(a),
				ga: (a, b, d) => {
					d ? N[d >> 2] = U.getBufferParameter(a, b) : W ||= 1281;
				},
				ha: () => {
					var a = U.getError() || W;
					W = 0;
					return a;
				},
				ia: (a, b) => xd(a, b, 2),
				Wb: (a, b, d, f) => {
					a = U.getFramebufferAttachmentParameter(a, b, d);
					if (a instanceof WebGLRenderbuffer || a instanceof WebGLTexture) a = a.name | 0;
					N[f >> 2] = a;
				},
				ja: yd,
				ka: (a, b, d, f) => {
					a = U.getProgramInfoLog(Xc[a]);
					null === a && (a = "(unknown error)");
					b = 0 < b && f ? Ba(a, f, b) : 0;
					d && (N[d >> 2] = b);
				},
				la: (a, b, d) => {
					if (d) if (a >= Vc) W ||= 1281;
					else if (a = Xc[a], 35716 == b) a = U.getProgramInfoLog(a), null === a && (a = "(unknown error)"), N[d >> 2] = a.length + 1;
					else if (35719 == b) {
						if (!a.Se) {
							var f = U.getProgramParameter(a, 35718);
							for (b = 0; b < f; ++b) a.Se = Math.max(a.Se, U.getActiveUniform(a, b).name.length + 1);
						}
						N[d >> 2] = a.Se;
					} else if (35722 == b) {
						if (!a.Qe) for (f = U.getProgramParameter(a, 35721), b = 0; b < f; ++b) a.Qe = Math.max(a.Qe, U.getActiveAttrib(a, b).name.length + 1);
						N[d >> 2] = a.Qe;
					} else if (35381 == b) {
						if (!a.Re) for (f = U.getProgramParameter(a, 35382), b = 0; b < f; ++b) a.Re = Math.max(a.Re, U.getActiveUniformBlockName(a, b).length + 1);
						N[d >> 2] = a.Re;
					} else N[d >> 2] = U.getProgramParameter(a, b);
					else W ||= 1281;
				},
				rb: zd,
				sb: zd,
				Fb: (a, b, d) => {
					if (d) {
						a = U.getQueryParameter(bd[a], b);
						var f;
						"boolean" == typeof a ? f = a ? 1 : 0 : f = a;
						N[d >> 2] = f;
					} else W ||= 1281;
				},
				yb: (a, b, d) => {
					if (d) {
						a = U.ee.getQueryObjectEXT(bd[a], b);
						var f;
						"boolean" == typeof a ? f = a ? 1 : 0 : f = a;
						N[d >> 2] = f;
					} else W ||= 1281;
				},
				Gb: (a, b, d) => {
					d ? N[d >> 2] = U.getQuery(a, b) : W ||= 1281;
				},
				zb: (a, b, d) => {
					d ? N[d >> 2] = U.ee.getQueryEXT(a, b) : W ||= 1281;
				},
				Xb: (a, b, d) => {
					d ? N[d >> 2] = U.getRenderbufferParameter(a, b) : W ||= 1281;
				},
				ma: (a, b, d, f) => {
					a = U.getShaderInfoLog($c[a]);
					null === a && (a = "(unknown error)");
					b = 0 < b && f ? Ba(a, f, b) : 0;
					d && (N[d >> 2] = b);
				},
				ob: (a, b, d, f) => {
					a = U.getShaderPrecisionFormat(a, b);
					N[d >> 2] = a.rangeMin;
					N[d + 4 >> 2] = a.rangeMax;
					N[f >> 2] = a.precision;
				},
				na: (a, b, d) => {
					d ? 35716 == b ? (a = U.getShaderInfoLog($c[a]), null === a && (a = "(unknown error)"), N[d >> 2] = a ? a.length + 1 : 0) : 35720 == b ? (a = U.getShaderSource($c[a]), N[d >> 2] = a ? a.length + 1 : 0) : N[d >> 2] = U.getShaderParameter($c[a], b) : W ||= 1281;
				},
				oa: Cd,
				vc: Dd,
				pa: (a, b) => {
					b = b ? kb(Ra, b) : "";
					if (a = Xc[a]) {
						var d = a, f = d.He, h = d.lf, n;
						if (!f) {
							d.He = f = {};
							d.kf = {};
							var v = U.getProgramParameter(d, 35718);
							for (n = 0; n < v; ++n) {
								var m = U.getActiveUniform(d, n);
								var q = m.name;
								m = m.size;
								var w = Ed(q);
								w = 0 < w ? q.slice(0, w) : q;
								var D = d.$e;
								d.$e += m;
								h[w] = [m, D];
								for (q = 0; q < m; ++q) f[D] = q, d.kf[D++] = w;
							}
						}
						d = a.He;
						f = 0;
						h = b;
						n = Ed(b);
						0 < n && (f = parseInt(b.slice(n + 1)) >>> 0, h = b.slice(0, n));
						if ((h = a.lf[h]) && f < h[0] && (f += h[1], d[f] = d[f] || U.getUniformLocation(a, b))) return f;
					} else W ||= 1281;
					return -1;
				},
				pb: (a, b, d) => {
					for (var f = ud[b], h = 0; h < b; h++) f[h] = N[d + 4 * h >> 2];
					U.invalidateFramebuffer(a, f);
				},
				qb: (a, b, d, f, h, n, v) => {
					for (var m = ud[b], q = 0; q < b; q++) m[q] = N[d + 4 * q >> 2];
					U.invalidateSubFramebuffer(a, m, f, h, n, v);
				},
				Ob: (a) => U.isSync(dd[a]),
				qa: (a) => (a = ra[a]) ? U.isTexture(a) : 0,
				ra: (a) => U.lineWidth(a),
				sa: (a) => {
					a = Xc[a];
					U.linkProgram(a);
					a.He = 0;
					a.lf = {};
				},
				kc: (a, b, d, f, h, n) => {
					U.hf.multiDrawArraysInstancedBaseInstanceWEBGL(a, N, b >> 2, N, d >> 2, N, f >> 2, O, h >> 2, n);
				},
				lc: (a, b, d, f, h, n, v, m) => {
					U.hf.multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL(a, N, b >> 2, d, N, f >> 2, N, h >> 2, N, n >> 2, O, v >> 2, m);
				},
				ta: (a, b) => {
					3317 == a ? gd = b : 3314 == a && (hd = b);
					U.pixelStorei(a, b);
				},
				tb: (a, b) => {
					U.ee.queryCounterEXT(bd[a], b);
				},
				nc: (a) => U.readBuffer(a),
				ua: (a, b, d, f, h, n, v) => {
					if (2 <= I.version) if (U.We) U.readPixels(a, b, d, f, h, n, v);
					else {
						var m = Fd(n);
						v >>>= 31 - Math.clz32(m.BYTES_PER_ELEMENT);
						U.readPixels(a, b, d, f, h, n, m, v);
					}
					else (m = Gd(n, h, d, f, v)) ? U.readPixels(a, b, d, f, h, n, m) : W ||= 1280;
				},
				Yb: (a, b, d, f) => U.renderbufferStorage(a, b, d, f),
				Ub: (a, b, d, f, h) => U.renderbufferStorageMultisample(a, b, d, f, h),
				Kb: (a, b, d) => {
					U.samplerParameterf(cd[a], b, d);
				},
				Lb: (a, b, d) => {
					U.samplerParameteri(cd[a], b, d);
				},
				Mb: (a, b, d) => {
					U.samplerParameteri(cd[a], b, N[d >> 2]);
				},
				va: (a, b, d, f) => U.scissor(a, b, d, f),
				wa: (a, b, d, f) => {
					for (var h = "", n = 0; n < b; ++n) {
						var v = (v = O[d + 4 * n >> 2]) ? kb(Ra, v, f ? O[f + 4 * n >> 2] : void 0) : "";
						h += v;
					}
					U.shaderSource($c[a], h);
				},
				xa: (a, b, d) => U.stencilFunc(a, b, d),
				ya: (a, b, d, f) => U.stencilFuncSeparate(a, b, d, f),
				za: (a) => U.stencilMask(a),
				Aa: (a, b) => U.stencilMaskSeparate(a, b),
				Ba: (a, b, d) => U.stencilOp(a, b, d),
				Ca: (a, b, d, f) => U.stencilOpSeparate(a, b, d, f),
				Da: (a, b, d, f, h, n, v, m, q) => {
					if (2 <= I.version) {
						if (U.ye) {
							U.texImage2D(a, b, d, f, h, n, v, m, q);
							return;
						}
						if (q) {
							var w = Fd(m);
							q >>>= 31 - Math.clz32(w.BYTES_PER_ELEMENT);
							U.texImage2D(a, b, d, f, h, n, v, m, w, q);
							return;
						}
					}
					w = q ? Gd(m, v, f, h, q) : null;
					U.texImage2D(a, b, d, f, h, n, v, m, w);
				},
				Ea: (a, b, d) => U.texParameterf(a, b, d),
				Fa: (a, b, d) => {
					U.texParameterf(a, b, R[d >> 2]);
				},
				Ga: (a, b, d) => U.texParameteri(a, b, d),
				Ha: (a, b, d) => {
					U.texParameteri(a, b, N[d >> 2]);
				},
				hc: (a, b, d, f, h) => U.texStorage2D(a, b, d, f, h),
				Ia: (a, b, d, f, h, n, v, m, q) => {
					if (2 <= I.version) {
						if (U.ye) {
							U.texSubImage2D(a, b, d, f, h, n, v, m, q);
							return;
						}
						if (q) {
							var w = Fd(m);
							U.texSubImage2D(a, b, d, f, h, n, v, m, w, q >>> 31 - Math.clz32(w.BYTES_PER_ELEMENT));
							return;
						}
					}
					q = q ? Gd(m, v, h, n, q) : null;
					U.texSubImage2D(a, b, d, f, h, n, v, m, q);
				},
				Ja: (a, b) => {
					U.uniform1f(Z(a), b);
				},
				Ka: (a, b, d) => {
					if (2 <= I.version) b && U.uniform1fv(Z(a), R, d >> 2, b);
					else {
						if (288 >= b) for (var f = Hd[b], h = 0; h < b; ++h) f[h] = R[d + 4 * h >> 2];
						else f = R.subarray(d >> 2, d + 4 * b >> 2);
						U.uniform1fv(Z(a), f);
					}
				},
				Tc: (a, b) => {
					U.uniform1i(Z(a), b);
				},
				Uc: (a, b, d) => {
					if (2 <= I.version) b && U.uniform1iv(Z(a), N, d >> 2, b);
					else {
						if (288 >= b) for (var f = Id[b], h = 0; h < b; ++h) f[h] = N[d + 4 * h >> 2];
						else f = N.subarray(d >> 2, d + 4 * b >> 2);
						U.uniform1iv(Z(a), f);
					}
				},
				Vc: (a, b, d) => {
					U.uniform2f(Z(a), b, d);
				},
				Wc: (a, b, d) => {
					if (2 <= I.version) b && U.uniform2fv(Z(a), R, d >> 2, 2 * b);
					else {
						if (144 >= b) {
							b *= 2;
							for (var f = Hd[b], h = 0; h < b; h += 2) f[h] = R[d + 4 * h >> 2], f[h + 1] = R[d + (4 * h + 4) >> 2];
						} else f = R.subarray(d >> 2, d + 8 * b >> 2);
						U.uniform2fv(Z(a), f);
					}
				},
				Sc: (a, b, d) => {
					U.uniform2i(Z(a), b, d);
				},
				Rc: (a, b, d) => {
					if (2 <= I.version) b && U.uniform2iv(Z(a), N, d >> 2, 2 * b);
					else {
						if (144 >= b) {
							b *= 2;
							for (var f = Id[b], h = 0; h < b; h += 2) f[h] = N[d + 4 * h >> 2], f[h + 1] = N[d + (4 * h + 4) >> 2];
						} else f = N.subarray(d >> 2, d + 8 * b >> 2);
						U.uniform2iv(Z(a), f);
					}
				},
				Qc: (a, b, d, f) => {
					U.uniform3f(Z(a), b, d, f);
				},
				Pc: (a, b, d) => {
					if (2 <= I.version) b && U.uniform3fv(Z(a), R, d >> 2, 3 * b);
					else {
						if (96 >= b) {
							b *= 3;
							for (var f = Hd[b], h = 0; h < b; h += 3) f[h] = R[d + 4 * h >> 2], f[h + 1] = R[d + (4 * h + 4) >> 2], f[h + 2] = R[d + (4 * h + 8) >> 2];
						} else f = R.subarray(d >> 2, d + 12 * b >> 2);
						U.uniform3fv(Z(a), f);
					}
				},
				Oc: (a, b, d, f) => {
					U.uniform3i(Z(a), b, d, f);
				},
				Nc: (a, b, d) => {
					if (2 <= I.version) b && U.uniform3iv(Z(a), N, d >> 2, 3 * b);
					else {
						if (96 >= b) {
							b *= 3;
							for (var f = Id[b], h = 0; h < b; h += 3) f[h] = N[d + 4 * h >> 2], f[h + 1] = N[d + (4 * h + 4) >> 2], f[h + 2] = N[d + (4 * h + 8) >> 2];
						} else f = N.subarray(d >> 2, d + 12 * b >> 2);
						U.uniform3iv(Z(a), f);
					}
				},
				Mc: (a, b, d, f, h) => {
					U.uniform4f(Z(a), b, d, f, h);
				},
				Lc: (a, b, d) => {
					if (2 <= I.version) b && U.uniform4fv(Z(a), R, d >> 2, 4 * b);
					else {
						if (72 >= b) {
							var f = Hd[4 * b], h = R;
							d >>= 2;
							b *= 4;
							for (var n = 0; n < b; n += 4) {
								var v = d + n;
								f[n] = h[v];
								f[n + 1] = h[v + 1];
								f[n + 2] = h[v + 2];
								f[n + 3] = h[v + 3];
							}
						} else f = R.subarray(d >> 2, d + 16 * b >> 2);
						U.uniform4fv(Z(a), f);
					}
				},
				zc: (a, b, d, f, h) => {
					U.uniform4i(Z(a), b, d, f, h);
				},
				Ac: (a, b, d) => {
					if (2 <= I.version) b && U.uniform4iv(Z(a), N, d >> 2, 4 * b);
					else {
						if (72 >= b) {
							b *= 4;
							for (var f = Id[b], h = 0; h < b; h += 4) f[h] = N[d + 4 * h >> 2], f[h + 1] = N[d + (4 * h + 4) >> 2], f[h + 2] = N[d + (4 * h + 8) >> 2], f[h + 3] = N[d + (4 * h + 12) >> 2];
						} else f = N.subarray(d >> 2, d + 16 * b >> 2);
						U.uniform4iv(Z(a), f);
					}
				},
				Bc: (a, b, d, f) => {
					if (2 <= I.version) b && U.uniformMatrix2fv(Z(a), !!d, R, f >> 2, 4 * b);
					else {
						if (72 >= b) {
							b *= 4;
							for (var h = Hd[b], n = 0; n < b; n += 4) h[n] = R[f + 4 * n >> 2], h[n + 1] = R[f + (4 * n + 4) >> 2], h[n + 2] = R[f + (4 * n + 8) >> 2], h[n + 3] = R[f + (4 * n + 12) >> 2];
						} else h = R.subarray(f >> 2, f + 16 * b >> 2);
						U.uniformMatrix2fv(Z(a), !!d, h);
					}
				},
				Cc: (a, b, d, f) => {
					if (2 <= I.version) b && U.uniformMatrix3fv(Z(a), !!d, R, f >> 2, 9 * b);
					else {
						if (32 >= b) {
							b *= 9;
							for (var h = Hd[b], n = 0; n < b; n += 9) h[n] = R[f + 4 * n >> 2], h[n + 1] = R[f + (4 * n + 4) >> 2], h[n + 2] = R[f + (4 * n + 8) >> 2], h[n + 3] = R[f + (4 * n + 12) >> 2], h[n + 4] = R[f + (4 * n + 16) >> 2], h[n + 5] = R[f + (4 * n + 20) >> 2], h[n + 6] = R[f + (4 * n + 24) >> 2], h[n + 7] = R[f + (4 * n + 28) >> 2], h[n + 8] = R[f + (4 * n + 32) >> 2];
						} else h = R.subarray(f >> 2, f + 36 * b >> 2);
						U.uniformMatrix3fv(Z(a), !!d, h);
					}
				},
				Dc: (a, b, d, f) => {
					if (2 <= I.version) b && U.uniformMatrix4fv(Z(a), !!d, R, f >> 2, 16 * b);
					else {
						if (18 >= b) {
							var h = Hd[16 * b], n = R;
							f >>= 2;
							b *= 16;
							for (var v = 0; v < b; v += 16) {
								var m = f + v;
								h[v] = n[m];
								h[v + 1] = n[m + 1];
								h[v + 2] = n[m + 2];
								h[v + 3] = n[m + 3];
								h[v + 4] = n[m + 4];
								h[v + 5] = n[m + 5];
								h[v + 6] = n[m + 6];
								h[v + 7] = n[m + 7];
								h[v + 8] = n[m + 8];
								h[v + 9] = n[m + 9];
								h[v + 10] = n[m + 10];
								h[v + 11] = n[m + 11];
								h[v + 12] = n[m + 12];
								h[v + 13] = n[m + 13];
								h[v + 14] = n[m + 14];
								h[v + 15] = n[m + 15];
							}
						} else h = R.subarray(f >> 2, f + 64 * b >> 2);
						U.uniformMatrix4fv(Z(a), !!d, h);
					}
				},
				Ec: (a) => {
					a = Xc[a];
					U.useProgram(a);
					U.wf = a;
				},
				Fc: (a, b) => U.vertexAttrib1f(a, b),
				Gc: (a, b) => {
					U.vertexAttrib2f(a, R[b >> 2], R[b + 4 >> 2]);
				},
				Hc: (a, b) => {
					U.vertexAttrib3f(a, R[b >> 2], R[b + 4 >> 2], R[b + 8 >> 2]);
				},
				Ic: (a, b) => {
					U.vertexAttrib4f(a, R[b >> 2], R[b + 4 >> 2], R[b + 8 >> 2], R[b + 12 >> 2]);
				},
				ic: (a, b) => {
					U.vertexAttribDivisor(a, b);
				},
				jc: (a, b, d, f, h) => {
					U.vertexAttribIPointer(a, b, d, f, h);
				},
				Jc: (a, b, d, f, h, n) => {
					U.vertexAttribPointer(a, b, d, !!f, h, n);
				},
				Kc: (a, b, d, f) => U.viewport(a, b, d, f),
				Pb: (a, b, d) => {
					d = Number(d);
					U.waitSync(dd[a], b, d);
				},
				Za: (a) => {
					var b = Ra.length;
					a >>>= 0;
					if (2147483648 < a) return !1;
					for (var d = 1; 4 >= d; d *= 2) {
						var f = b * (1 + .2 / d);
						f = Math.min(f, a + 100663296);
						a: {
							f = (Math.min(2147483648, 65536 * Math.ceil(Math.max(a, f) / 65536)) - La.buffer.byteLength + 65535) / 65536 | 0;
							try {
								La.grow(f);
								Xa();
								var h = 1;
								break a;
							} catch (n) {}
							h = void 0;
						}
						if (h) return !0;
					}
					return !1;
				},
				Va: () => I ? I.handle : 0,
				cb: (a, b) => {
					var d = 0, f = 0, h;
					for (h of Ld()) {
						var n = b + d;
						O[a + f >> 2] = n;
						d += Ba(h, n, Infinity) + 1;
						f += 4;
					}
					return 0;
				},
				db: (a, b) => {
					var d = Ld();
					O[a >> 2] = d.length;
					a = 0;
					for (var f of d) a += Aa(f) + 1;
					O[b >> 2] = a;
					return 0;
				},
				mb: (a) => {
					Da(a, new ib(a));
				},
				N: () => 52,
				_a: function() {
					return 52;
				},
				ib: () => 52,
				bb: function() {
					return 70;
				},
				R: (a, b, d, f) => {
					for (var h = 0, n = 0; n < d; n++) {
						var v = O[b >> 2], m = O[b + 4 >> 2];
						b += 8;
						for (var q = 0; q < m; q++) {
							var w = a, D = Ra[v + q], G = Md[w];
							0 === D || 10 === D ? ((1 === w ? Ja : Ka)(kb(G)), G.length = 0) : G.push(D);
						}
						h += m;
					}
					O[f >> 2] = h;
					return 0;
				},
				vd: od,
				Wa: qd,
				ud: rd,
				Bb: sd,
				L: yd,
				O: Cd,
				La: Dd,
				Ma: Sd,
				h: Td,
				q: Ud,
				j: Vd,
				H: Wd,
				nb: Xd,
				V: Yd,
				U: Zd,
				K: $d,
				n: ae,
				o: be,
				v: ce,
				r: de,
				Pa: ee,
				Na: fe,
				Oa: ge
			}, ie = await async function() {
				Ya++;
				var a = { a: he };
				eb ??= u.locateFile ? u.locateFile("canvaskit.wasm", Ea) : Ea + "canvaskit.wasm";
				try {
					return ie = (await hb(a)).instance.exports, La = ie.wd, Xa(), dc = ie.zd, Ya--, 0 == Ya && bb && (a = bb, bb = null, a()), ie;
				} catch (b) {
					return ha(b), Promise.reject(b);
				}
			}(), gc = ie.yd, Ad = u._malloc = ie.Ad, hc = u._free = ie.Bd, je = ie.Cd, ke = ie.Dd, le = ie.Ed;
			function Vd(a, b, d, f) {
				var h = le();
				try {
					return dc.get(a)(b, d, f);
				} catch (n) {
					ke(h);
					if (n !== n + 0) throw n;
					je(1, 0);
				}
			}
			function ee(a, b, d, f, h, n) {
				var v = le();
				try {
					dc.get(a)(b, d, f, h, n);
				} catch (m) {
					ke(v);
					if (m !== m + 0) throw m;
					je(1, 0);
				}
			}
			function de(a, b, d, f, h) {
				var n = le();
				try {
					dc.get(a)(b, d, f, h);
				} catch (v) {
					ke(n);
					if (v !== v + 0) throw v;
					je(1, 0);
				}
			}
			function be(a, b, d) {
				var f = le();
				try {
					dc.get(a)(b, d);
				} catch (h) {
					ke(f);
					if (h !== h + 0) throw h;
					je(1, 0);
				}
			}
			function Wd(a, b, d, f, h) {
				var n = le();
				try {
					return dc.get(a)(b, d, f, h);
				} catch (v) {
					ke(n);
					if (v !== v + 0) throw v;
					je(1, 0);
				}
			}
			function Td(a, b) {
				var d = le();
				try {
					return dc.get(a)(b);
				} catch (f) {
					ke(d);
					if (f !== f + 0) throw f;
					je(1, 0);
				}
			}
			function ce(a, b, d, f) {
				var h = le();
				try {
					dc.get(a)(b, d, f);
				} catch (n) {
					ke(h);
					if (n !== n + 0) throw n;
					je(1, 0);
				}
			}
			function ae(a, b) {
				var d = le();
				try {
					dc.get(a)(b);
				} catch (f) {
					ke(d);
					if (f !== f + 0) throw f;
					je(1, 0);
				}
			}
			function ge(a, b, d, f, h, n, v, m, q, w) {
				var D = le();
				try {
					dc.get(a)(b, d, f, h, n, v, m, q, w);
				} catch (G) {
					ke(D);
					if (G !== G + 0) throw G;
					je(1, 0);
				}
			}
			function $d(a) {
				var b = le();
				try {
					dc.get(a)();
				} catch (d) {
					ke(b);
					if (d !== d + 0) throw d;
					je(1, 0);
				}
			}
			function Ud(a, b, d) {
				var f = le();
				try {
					return dc.get(a)(b, d);
				} catch (h) {
					ke(f);
					if (h !== h + 0) throw h;
					je(1, 0);
				}
			}
			function fe(a, b, d, f, h, n, v) {
				var m = le();
				try {
					dc.get(a)(b, d, f, h, n, v);
				} catch (q) {
					ke(m);
					if (q !== q + 0) throw q;
					je(1, 0);
				}
			}
			function Sd(a) {
				var b = le();
				try {
					return dc.get(a)();
				} catch (d) {
					ke(b);
					if (d !== d + 0) throw d;
					je(1, 0);
				}
			}
			function Yd(a, b, d, f, h, n, v, m) {
				var q = le();
				try {
					return dc.get(a)(b, d, f, h, n, v, m);
				} catch (w) {
					ke(q);
					if (w !== w + 0) throw w;
					je(1, 0);
				}
			}
			function Zd(a, b, d, f, h, n, v, m, q, w) {
				var D = le();
				try {
					return dc.get(a)(b, d, f, h, n, v, m, q, w);
				} catch (G) {
					ke(D);
					if (G !== G + 0) throw G;
					je(1, 0);
				}
			}
			function Xd(a, b, d, f, h, n, v) {
				var m = le();
				try {
					return dc.get(a)(b, d, f, h, n, v);
				} catch (q) {
					ke(m);
					if (q !== q + 0) throw q;
					je(1, 0);
				}
			}
			function me() {
				0 < Ya ? bb = me : 0 < Ya ? bb = me : (u.calledRun = !0, Oa || (ie.xd(), da(u), u.onRuntimeInitialized?.()));
			}
			me();
			moduleRtn = ka;
			return moduleRtn;
		});
	})();
	if (typeof exports === "object" && typeof module === "object") {
		module.exports = CanvasKitInit;
		module.exports.default = CanvasKitInit;
	} else if (typeof define === "function" && define["amd"]) define([], () => CanvasKitInit);
})))(), 1);
//#endregion
//#region src/view/canvaskit-wasm-url.ts
var canvaskit_wasm_url_default = "/rhwp/assets/canvaskit-DB1zH3nD.wasm";
function boundedCanvasKitSourceImageKey(value) {
	return value !== void 0 && value.length > 0 && value.length <= 256 && !/[\u0000-\u001f\u007f]/.test(value) ? value : null;
}
function canvasKitImageCacheKey(input, documentGeneration) {
	const parts = [];
	const sourceImageKey = boundedCanvasKitSourceImageKey(input.sourceImageKey);
	if (sourceImageKey !== null) parts.push(`source:${sourceImageKey}`);
	else {
		if (typeof input.imageRef === "number" && Number.isSafeInteger(input.imageRef) || typeof input.imageRef === "string" && input.imageRef.length > 0 && input.imageRef.length <= 256 && !/[\u0000-\u001f\u007f]/.test(input.imageRef)) parts.push(`ref:${String(input.imageRef)}`);
		if (input.base64) {
			const mime = input.mime && input.mime.length <= 128 && !/[\u0000-\u001f\u007f]/.test(input.mime) ? input.mime : "application/octet-stream";
			const digest = bytesToHex(blake3(new TextEncoder().encode(input.base64)));
			parts.push(`${mime}:${input.base64.length}:blake3:${digest}`);
		}
	}
	if (parts.length === 0) return null;
	return Number.isSafeInteger(documentGeneration) ? `document:${documentGeneration}|${parts.join("|")}` : parts.join("|");
}
function canvasKitImageSourceRect(imageWidth, imageHeight, crop, cropReferenceSize) {
	if (!crop) return null;
	if (!Number.isFinite(imageWidth) || !Number.isFinite(imageHeight) || imageWidth <= 0 || imageHeight <= 0 || !Number.isFinite(crop.left) || !Number.isFinite(crop.top) || !Number.isFinite(crop.right) || !Number.isFinite(crop.bottom)) return null;
	const referenceWidth = cropReferenceSize?.[0];
	const referenceHeight = cropReferenceSize?.[1];
	const scaleX = Number.isFinite(referenceWidth) && (referenceWidth ?? 0) > 0 ? referenceWidth / imageWidth : 75;
	const scaleY = Number.isFinite(referenceHeight) && (referenceHeight ?? 0) > 0 ? referenceHeight / imageHeight : 75;
	const x = crop.left / scaleX;
	const y = crop.top / scaleY;
	const width = (crop.right - crop.left) / scaleX;
	const height = (crop.bottom - crop.top) / scaleY;
	if (width <= 0 || height <= 0) return null;
	const clampedX = clamp(x, 0, imageWidth);
	const clampedY = clamp(y, 0, imageHeight);
	const clampedWidth = clamp(width, 0, imageWidth - clampedX);
	const clampedHeight = clamp(height, 0, imageHeight - clampedY);
	if (clampedWidth <= 0 || clampedHeight <= 0) return null;
	if (!(x > .5 || y > .5 || Math.abs(clampedWidth - imageWidth) > 1 || Math.abs(clampedHeight - imageHeight) > 1)) return null;
	return {
		x: clampedX,
		y: clampedY,
		width: clampedWidth,
		height: clampedHeight
	};
}
function canvasKitImagePlacement(fillMode, bbox, imageWidth, imageHeight) {
	switch (fillMode) {
		case "centerTop": return {
			x: bbox.x + (bbox.width - imageWidth) / 2,
			y: bbox.y
		};
		case "rightTop": return {
			x: bbox.x + bbox.width - imageWidth,
			y: bbox.y
		};
		case "leftCenter": return {
			x: bbox.x,
			y: bbox.y + (bbox.height - imageHeight) / 2
		};
		case "center": return {
			x: bbox.x + (bbox.width - imageWidth) / 2,
			y: bbox.y + (bbox.height - imageHeight) / 2
		};
		case "rightCenter": return {
			x: bbox.x + bbox.width - imageWidth,
			y: bbox.y + (bbox.height - imageHeight) / 2
		};
		case "leftBottom": return {
			x: bbox.x,
			y: bbox.y + bbox.height - imageHeight
		};
		case "centerBottom": return {
			x: bbox.x + (bbox.width - imageWidth) / 2,
			y: bbox.y + bbox.height - imageHeight
		};
		case "rightBottom": return {
			x: bbox.x + bbox.width - imageWidth,
			y: bbox.y + bbox.height - imageHeight
		};
		default: return {
			x: bbox.x,
			y: bbox.y
		};
	}
}
function canvasKitImageFillModeTiles(fillMode) {
	return fillMode === "tileAll" || fillMode === "tileHorzTop" || fillMode === "tileHorzBottom" || fillMode === "tileVertLeft" || fillMode === "tileVertRight";
}
function canvasKitImageFillModeStretches(fillMode) {
	return fillMode === void 0 || fillMode === "fitToSize" || fillMode === "total";
}
function clamp(value, min, max) {
	return Math.max(min, Math.min(max, value));
}
function encodedImageHeader(bytes) {
	return parsePngHeader(bytes) ?? parseGifHeader(bytes) ?? parseWebpHeader(bytes) ?? parseBmpHeader(bytes) ?? parseJpegHeader(bytes);
}
/** CanvasKit decode 전에 지원 형식과 bounded raster dimensions를 확인한다. */
function replayableEncodedImageHeader(bytes) {
	if (bytes.byteLength === 0 || Math.ceil(bytes.byteLength / 3) * 4 > 25165824) return null;
	const header = encodedImageHeader(bytes);
	if (!header) return null;
	const pixels = header.width * header.height;
	return header.width <= 8192 && header.height <= 8192 && Number.isSafeInteger(pixels) && pixels <= 33554432 ? header : null;
}
function decodedImageMatchesEncodedHeader(header, width, height) {
	if (!Number.isSafeInteger(width) || !Number.isSafeInteger(height) || width <= 0 || height <= 0 || width > 8192 || height > 8192) return false;
	const pixels = width * height;
	if (!Number.isSafeInteger(pixels) || pixels > 33554432) return false;
	return width === header.width && height === header.height || header.format === "jpeg" && width === header.height && height === header.width;
}
function parsePngHeader(bytes) {
	if (bytes.byteLength < 33 || !bytesEqual(bytes, 0, [
		137,
		80,
		78,
		71,
		13,
		10,
		26,
		10
	]) || readUint32(bytes, 8, false) !== 13 || !bytesEqual(bytes, 12, [
		73,
		72,
		68,
		82
	])) return null;
	const width = readUint32(bytes, 16, false);
	const height = readUint32(bytes, 20, false);
	const bitDepth = bytes[24];
	const colorType = bytes[25];
	const validDepth = colorType === 0 ? [
		1,
		2,
		4,
		8,
		16
	].includes(bitDepth) : [
		2,
		4,
		6
	].includes(colorType) ? [8, 16].includes(bitDepth) : colorType === 3 && [
		1,
		2,
		4,
		8
	].includes(bitDepth);
	if (width === 0 || height === 0 || !validDepth || bytes[26] !== 0 || bytes[27] !== 0 || bytes[28] > 1) return null;
	return {
		format: "png",
		width,
		height
	};
}
function parseGifHeader(bytes) {
	if (bytes.byteLength < 13 || !bytesEqual(bytes, 0, [
		71,
		73,
		70,
		56,
		55,
		97
	]) && !bytesEqual(bytes, 0, [
		71,
		73,
		70,
		56,
		57,
		97
	])) return null;
	const width = readUint16(bytes, 6, true);
	const height = readUint16(bytes, 8, true);
	if (width === 0 || height === 0) return null;
	const packed = bytes[10];
	if ((packed & 128) !== 0) {
		const colorCount = 1 << (packed & 7) + 1;
		if (bytes.byteLength < 13 + colorCount * 3) return null;
	}
	return {
		format: "gif",
		width,
		height
	};
}
function parseWebpHeader(bytes) {
	if (bytes.byteLength < 20 || !bytesEqual(bytes, 0, [
		82,
		73,
		70,
		70
	]) || !bytesEqual(bytes, 8, [
		87,
		69,
		66,
		80
	])) return null;
	const riffEnd = readUint32(bytes, 4, true) + 8;
	const chunkLength = readUint32(bytes, 16, true);
	const chunkEnd = 20 + chunkLength + (chunkLength & 1);
	if (!Number.isSafeInteger(riffEnd) || !Number.isSafeInteger(chunkEnd) || riffEnd > bytes.byteLength || riffEnd < 20 || chunkEnd > riffEnd || chunkEnd > bytes.byteLength) return null;
	let width;
	let height;
	if (bytesEqual(bytes, 12, [
		86,
		80,
		56,
		88
	]) && chunkLength >= 10) {
		width = readUint24Le(bytes, 24) + 1;
		height = readUint24Le(bytes, 27) + 1;
	} else if (bytesEqual(bytes, 12, [
		86,
		80,
		56,
		32
	]) && chunkLength >= 10 && bytesEqual(bytes, 23, [
		157,
		1,
		42
	])) {
		width = readUint16(bytes, 26, true) & 16383;
		height = readUint16(bytes, 28, true) & 16383;
	} else if (bytesEqual(bytes, 12, [
		86,
		80,
		56,
		76
	]) && chunkLength >= 5 && bytes[20] === 47) {
		const bits = readUint32(bytes, 21, true);
		width = (bits & 16383) + 1;
		height = (bits >>> 14 & 16383) + 1;
	} else return null;
	return width > 0 && height > 0 ? {
		format: "webp",
		width,
		height
	} : null;
}
function parseBmpHeader(bytes) {
	if (bytes.byteLength < 54 || !bytesEqual(bytes, 0, [66, 77])) return null;
	const dibLength = readUint32(bytes, 14, true);
	const dibEnd = 14 + dibLength;
	const pixelOffset = readUint32(bytes, 10, true);
	const bitsPerPixel = readUint16(bytes, 28, true);
	if (dibLength < 40 || dibEnd > bytes.byteLength || pixelOffset < dibEnd || pixelOffset > bytes.byteLength || readUint16(bytes, 26, true) !== 1 || ![
		1,
		4,
		8,
		16,
		24,
		32
	].includes(bitsPerPixel)) return null;
	const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
	const width = view.getInt32(18, true);
	const height = view.getInt32(22, true);
	if (width <= 0 || height === 0 || height === -2147483648) return null;
	return {
		format: "bmp",
		width,
		height: Math.abs(height)
	};
}
function parseJpegHeader(bytes) {
	if (bytes.byteLength < 4 || !bytesEqual(bytes, 0, [255, 216])) return null;
	let offset = 2;
	while (offset < bytes.byteLength) {
		if (bytes[offset] !== 255) return null;
		while (offset < bytes.byteLength && bytes[offset] === 255) offset += 1;
		if (offset >= bytes.byteLength) return null;
		const marker = bytes[offset];
		offset += 1;
		if (marker === 0 || marker >= 216 && marker <= 218) return null;
		if (marker === 1 || marker >= 208 && marker <= 215) continue;
		if (offset + 2 > bytes.byteLength) return null;
		const segmentLength = readUint16(bytes, offset, false);
		const segmentEnd = offset + segmentLength;
		if (segmentLength < 2 || segmentEnd > bytes.byteLength) return null;
		if (marker >= 192 && marker <= 207 && ![
			196,
			200,
			204
		].includes(marker)) {
			if (segmentLength < 11 || offset + 8 > bytes.byteLength) return null;
			const componentCount = bytes[offset + 7];
			if (componentCount === 0 || segmentLength !== 8 + componentCount * 3) return null;
			const height = readUint16(bytes, offset + 3, false);
			const width = readUint16(bytes, offset + 5, false);
			return width > 0 && height > 0 ? {
				format: "jpeg",
				width,
				height
			} : null;
		}
		offset = segmentEnd;
	}
	return null;
}
function readUint16(bytes, offset, littleEndian) {
	return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint16(offset, littleEndian);
}
function readUint32(bytes, offset, littleEndian) {
	return new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(offset, littleEndian);
}
function readUint24Le(bytes, offset) {
	return bytes[offset] | bytes[offset + 1] << 8 | bytes[offset + 2] << 16;
}
function bytesEqual(bytes, offset, expected) {
	if (offset < 0 || offset + expected.length > bytes.byteLength) return false;
	return expected.every((byte, index) => bytes[offset + index] === byte);
}
//#endregion
//#region src/view/canvaskit/policy.ts
function canvaskitClipRightPad(renderMode, profile, clipKind, rightOverflowSlop) {
	if (typeof rightOverflowSlop === "number" && Number.isFinite(rightOverflowSlop)) return Math.max(0, rightOverflowSlop);
	if (renderMode === "compat" && profile === "fastPreview" && clipKind === "body") return 4;
	return 0;
}
//#endregion
//#region src/view/canvaskit/sfnt-face.ts
var TTC_TAG = 1953784678;
var TTC_VERSION_1 = 65536;
var TTC_VERSION_2 = 131072;
var MAX_TTC_FACE_COUNT = 4096;
var MAX_SFNT_TABLE_COUNT = 4096;
var MAX_NORMALIZED_SFNT_BYTES = 67108864;
var HEAD_TAG = 1751474532;
var SFNT_CHECKSUM_MAGIC = 2981146554;
function canvasKitFontFaceData(fontData, faceIndex) {
	if (!Number.isInteger(faceIndex) || faceIndex < 0 || faceIndex > 4294967295) return null;
	const bytes = new Uint8Array(fontData);
	if (bytes.byteLength < 4) return faceIndex === 0 ? fontData.slice(0) : null;
	const view = new DataView(fontData);
	if (view.getUint32(0, false) !== TTC_TAG) return faceIndex === 0 ? fontData.slice(0) : null;
	if (bytes.byteLength < 12) return null;
	const version = view.getUint32(4, false);
	const faceCount = view.getUint32(8, false);
	if (faceCount > MAX_TTC_FACE_COUNT) return null;
	const collectionHeaderLength = 12 + faceCount * 4 + (version === TTC_VERSION_2 ? 12 : 0);
	if (version !== TTC_VERSION_1 && version !== TTC_VERSION_2 || faceCount === 0 || faceIndex >= faceCount || collectionHeaderLength > bytes.byteLength) return null;
	const faceOffset = view.getUint32(12 + faceIndex * 4, false);
	if (faceOffset > bytes.byteLength - 12) return null;
	const sfntVersion = view.getUint32(faceOffset, false);
	const tableCount = view.getUint16(faceOffset + 4, false);
	const directoryLength = 12 + tableCount * 16;
	if (sfntVersion !== 65536 && sfntVersion !== 1330926671 && sfntVersion !== 1953658213 && sfntVersion !== 1954115633 || tableCount === 0 || tableCount > MAX_SFNT_TABLE_COUNT || directoryLength > bytes.byteLength - faceOffset) return null;
	const tables = [];
	let outputLength = directoryLength;
	for (let tableIndex = 0; tableIndex < tableCount; tableIndex += 1) {
		const recordOffset = faceOffset + 12 + tableIndex * 16;
		const tableOffset = view.getUint32(recordOffset + 8, false);
		const tableLength = view.getUint32(recordOffset + 12, false);
		if (tableLength > 0 && tableOffset < collectionHeaderLength || tableOffset > bytes.byteLength || tableLength > bytes.byteLength - tableOffset) return null;
		outputLength = Math.ceil(outputLength / 4) * 4;
		const outputOffset = outputLength;
		outputLength += tableLength;
		if (!Number.isSafeInteger(outputLength) || outputLength > MAX_NORMALIZED_SFNT_BYTES) return null;
		tables.push({
			recordOffset,
			sourceOffset: tableOffset,
			length: tableLength,
			outputOffset
		});
	}
	outputLength = Math.ceil(outputLength / 4) * 4;
	const selected = new Uint8Array(outputLength);
	const selectedView = new DataView(selected.buffer);
	selected.set(bytes.subarray(faceOffset, faceOffset + 12), 0);
	let headOffset = null;
	for (let tableIndex = 0; tableIndex < tables.length; tableIndex += 1) {
		const table = tables[tableIndex];
		const outputRecordOffset = 12 + tableIndex * 16;
		selected.set(bytes.subarray(table.recordOffset, table.recordOffset + 8), outputRecordOffset);
		selectedView.setUint32(outputRecordOffset + 8, table.outputOffset, false);
		selectedView.setUint32(outputRecordOffset + 12, table.length, false);
		selected.set(bytes.subarray(table.sourceOffset, table.sourceOffset + table.length), table.outputOffset);
		if (view.getUint32(table.recordOffset, false) === HEAD_TAG && table.length >= 12) headOffset = table.outputOffset;
	}
	if (headOffset !== null) {
		selectedView.setUint32(headOffset + 8, 0, false);
		let checksum = 0;
		for (let offset = 0; offset < selected.byteLength; offset += 4) checksum = checksum + selectedView.getUint32(offset, false) >>> 0;
		selectedView.setUint32(headOffset + 8, SFNT_CHECKSUM_MAGIC - checksum >>> 0, false);
	}
	return selected.buffer;
}
//#endregion
//#region src/view/canvaskit/glyph-run-fonts.ts
var MAX_FONT_BLOB_BYTES = 33554432;
var MAX_DOCUMENT_FONT_BLOB_BYTES = 67108864;
var MAX_ENCODED_FONT_BLOB_LENGTH = Math.ceil(MAX_FONT_BLOB_BYTES / 3) * 4;
var MAX_FONT_BLOB_RESOURCES = 256;
var MAX_FONT_FACE_RESOURCES = 256;
var MAX_GLYPHS_PER_RUN = 4096;
var MAX_GLYPH_RUN_TYPEFACES = 256;
var MAX_GLYPH_RUN_FONTS = 1024;
var MAX_FLOAT32 = 34028234663852886e22;
var FONT_RESOURCE_KEY = /^font:blake3:(0|[1-9][0-9]*):([0-9a-f]{64})$/;
var BASE64_PAYLOAD = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
var CanvasKitGlyphRunFontCache = class {
	canvasKit;
	verifiedFontBlobs = /* @__PURE__ */ new Map();
	glyphRunTypefaces = /* @__PURE__ */ new Map();
	glyphRunFonts = /* @__PURE__ */ new Map();
	registeredBlobBytes = 0;
	constructor(canvasKit) {
		this.canvasKit = canvasKit;
	}
	registerResources(fontResources, resources) {
		if (!Array.isArray(fontResources?.blobs) || fontResources.blobs.length === 0 || fontResources.blobs.length > MAX_FONT_BLOB_RESOURCES || !Array.isArray(fontResources.faces) || fontResources.faces.length > MAX_FONT_FACE_RESOURCES || !Array.isArray(resources?.fontBlobs) || resources.fontBlobs.length === 0 || resources.fontBlobs.length > MAX_FONT_BLOB_RESOURCES || !Array.isArray(resources.fontBlobKeys) || resources.fontBlobKeys.length > MAX_FONT_BLOB_RESOURCES) return;
		for (const blob of fontResources.blobs) {
			if (!blob || typeof blob !== "object" || blob.portability !== "portableBlob" || blob.digest?.algorithm !== "blake3" || blob.dataRef?.kind !== "fontBlob") continue;
			const cacheKey = this.fontBlobCacheKey(blob);
			if (this.verifiedFontBlobs.has(cacheKey)) continue;
			const resourceIndex = resources.fontBlobKeys?.indexOf(blob.dataRef.id) ?? -1;
			if (resourceIndex < 0) continue;
			const bytes = fontBlobPayloadBytes(resources.fontBlobs[resourceIndex]);
			if (!bytes || !fontResourceKeyMatches(blob.dataRef.id, blob.digest.value, bytes)) continue;
			if (this.registeredBlobBytes + bytes.byteLength > MAX_DOCUMENT_FONT_BLOB_BYTES) continue;
			if (this.verifiedFontBlobs.size >= MAX_FONT_BLOB_RESOURCES) break;
			const copy = bytes.slice();
			this.verifiedFontBlobs.set(cacheKey, copy.buffer);
			this.registeredBlobBytes += copy.byteLength;
		}
	}
	replayStatus(run, fontResources) {
		const report = this.baseReport(run);
		const reject = (reason, details = {}) => ({
			replayable: false,
			reason,
			report: {
				...report,
				...details
			}
		});
		if (!run || typeof run.diagnostics !== "object" || run.diagnostics === null || !Array.isArray(run.glyphIds) || !Array.isArray(run.positions) || run.advances !== void 0 && !Array.isArray(run.advances) || !Array.isArray(run.clusters) || run.glyphTransforms !== void 0 && !Array.isArray(run.glyphTransforms) || typeof run.paintStyle !== "object" || run.paintStyle === null || typeof run.shapeKey?.fontInstance !== "object" || run.shapeKey.fontInstance === null || typeof run.placement?.runToPage !== "object" || run.placement.runToPage === null) return reject("glyphRunMalformed");
		const instance = run.shapeKey.fontInstance;
		if (run.diagnostics.replayEligibility !== "portable") return reject("nonPortableGlyphRun");
		if (!run.diagnostics.strictVisualEligible) return reject("strictVisualIneligible");
		if (run.diagnostics.quality !== "exact" && run.diagnostics.quality !== "positionAdjusted") return reject("qualityNotStrictEligible");
		if (run.diagnostics.quality === "positionAdjusted" && (!Number.isFinite(run.diagnostics.maxResidualAfterAdjustmentPx) || run.diagnostics.maxResidualAfterAdjustmentPx > .25)) return reject("positionAdjustedResidualTooLarge");
		if (run.diagnostics.missingGlyphCount !== 0) return reject("missingGlyph");
		if (run.diagnostics.clusterMismatchCount !== 0) return reject("clusterMismatch");
		if (run.diagnostics.usedFallbackFontCount !== 0) return reject("fontNotPortable");
		if (run.orientation !== "horizontal") return reject("verticalGlyphOrientationAuthorityPending");
		if (run.glyphTransforms?.length) return reject("glyphTransformAuthorityPending");
		if (instance.syntheticBold !== false || instance.syntheticItalic !== false) return reject("syntheticStyleAuthorityPending");
		if (run.direction !== "ltr" || run.shapeKey.direction !== "ltr") return reject("bidiDirectionAuthorityPending");
		if (run.bidiLevel !== 0) return reject("bidiLevelAuthorityPending");
		if (run.writingMode !== "horizontal-tb" || run.shapeKey.writingMode !== "horizontal-tb") return reject("writingModeAuthorityPending");
		if (!run.glyphIds.length) return reject("emptyGlyphRun");
		if (run.glyphIds.length > MAX_GLYPHS_PER_RUN || run.positions.length > MAX_GLYPHS_PER_RUN || (run.advances?.length ?? 0) > MAX_GLYPHS_PER_RUN || run.clusters.length > MAX_GLYPHS_PER_RUN) return reject("glyphRunTooLarge");
		if (run.glyphIds.length !== run.positions.length) return reject("glyphPositionCountMismatch");
		if (run.advances && run.advances.length !== run.glyphIds.length) return reject("glyphAdvanceCountMismatch");
		if (run.glyphIds.some((glyphId) => !Number.isInteger(glyphId) || glyphId <= 0 || glyphId > 65535)) return reject("glyphIdOutOfRange");
		if (run.positions.some((point) => !Number.isFinite(point?.x) || !Number.isFinite(point?.y) || Math.abs(point.x) > MAX_FLOAT32 || Math.abs(point.y) > MAX_FLOAT32)) return reject("positionNotFinite");
		if (run.advances?.some((advance) => !Number.isFinite(advance?.dx) || !Number.isFinite(advance?.dy) || Math.abs(advance.dx) > MAX_FLOAT32 || Math.abs(advance.dy) > MAX_FLOAT32)) return reject("advanceNotFinite");
		const transform = run.placement?.runToPage;
		if (!transform || !Number.isFinite(run.placement.baselineY ?? 0) || ![
			transform.a,
			transform.b,
			transform.c,
			transform.d,
			transform.e,
			transform.f
		].every((value) => Number.isFinite(value) && Math.abs(value) <= MAX_FLOAT32) || Math.abs(run.placement.baselineY ?? 0) > MAX_FLOAT32) return reject("placementNotFinite");
		if (!glyphRunPaintIsSupported(run)) return reject("unsupportedPaintEffect", { effectSupported: false });
		if (run.shapeKey.fontInstance.variations?.length) return reject("variationUnsupported", { variationSupported: false });
		const fontSize = run.shapeKey.fontInstance.sizePx;
		if (!Number.isFinite(fontSize) || fontSize <= 0 || fontSize > 4096) return reject("fontInstanceInvalid");
		if (fontResources && (!Array.isArray(fontResources.faces) || !Array.isArray(fontResources.blobs))) return reject("fontResourceTableMalformed", { exactFaceInstantiated: false });
		if ((fontResources?.faces?.length ?? 0) > MAX_FONT_FACE_RESOURCES || (fontResources?.blobs?.length ?? 0) > MAX_FONT_BLOB_RESOURCES) return reject("fontResourceTableTooLarge", { exactFaceInstantiated: false });
		const face = fontResources?.faces?.find((candidate) => candidate?.id === run.shapeKey.fontInstance.faceKey);
		if (!face) return reject("fontFaceMissing", { exactFaceInstantiated: false });
		if (!Number.isInteger(face.faceIndex) || face.faceIndex < 0) return reject("faceIndexUnsupported", {
			exactFaceInstantiated: false,
			faceIndexSupported: false
		});
		const blob = fontResources?.blobs?.find((candidate) => candidate?.id === face.blobKey);
		if (!blob) return reject("fontBlobMissing", { exactFaceInstantiated: false });
		if (blob.portability !== "portableBlob" || blob.digest?.algorithm !== "blake3" || blob.dataRef?.kind !== "fontBlob") return reject("fontBlobNotPortable", {
			digestMatched: false,
			exactFaceInstantiated: false
		});
		if (!this.verifiedFontBlobs.has(this.fontBlobCacheKey(blob))) return reject("fontBlobNotVerified", {
			digestMatched: false,
			exactFaceInstantiated: false
		});
		const typefaceKey = this.typefaceCacheKey(face, blob);
		if (!this.glyphRunTypefaces.has(typefaceKey) && this.glyphRunTypefaces.size >= MAX_GLYPH_RUN_TYPEFACES) return reject("typefaceLimitExceeded", { exactFaceInstantiated: false });
		if (!this.typefaceFor(face, blob)) {
			const bytes = this.verifiedFontBlobs.get(this.fontBlobCacheKey(blob));
			const faceSupported = !!bytes && canvasKitFontFaceData(bytes, face.faceIndex) !== null;
			return reject(faceSupported ? "fontFaceInstantiationFailed" : "faceIndexUnsupported", {
				digestMatched: true,
				exactFaceInstantiated: false,
				faceIndexSupported: faceSupported
			});
		}
		const fontKey = this.fontCacheKey(run, face, blob);
		if (!this.glyphRunFonts.has(fontKey) && this.glyphRunFonts.size >= MAX_GLYPH_RUN_FONTS) return reject("fontInstanceLimitExceeded", { exactFaceInstantiated: true });
		return {
			replayable: true,
			face,
			blob,
			report: {
				...report,
				digestMatched: true,
				exactFaceInstantiated: true,
				faceIndexSupported: true,
				variationSupported: true,
				effectSupported: true
			}
		};
	}
	font(run, fontResources) {
		const status = this.replayStatus(run, fontResources);
		if (!status.replayable) return null;
		const typeface = this.typefaceFor(status.face, status.blob);
		if (!typeface) return null;
		const key = this.fontCacheKey(run, status.face, status.blob);
		const cached = this.glyphRunFonts.get(key);
		if (cached) return cached;
		if (this.glyphRunFonts.size >= MAX_GLYPH_RUN_FONTS) return null;
		const instance = run.shapeKey.fontInstance;
		const font = new this.canvasKit.Font(typeface, instance.sizePx);
		font.setSubpixel(true);
		font.setEmbolden(instance.syntheticBold === true);
		font.setSkewX(instance.syntheticItalic === true ? -.25 : 0);
		this.glyphRunFonts.set(key, font);
		return font;
	}
	diagnostics() {
		return {
			blobs: this.verifiedFontBlobs.size,
			typefaces: this.glyphRunTypefaces.size,
			fonts: this.glyphRunFonts.size,
			bytes: this.registeredBlobBytes
		};
	}
	clear() {
		for (const font of this.glyphRunFonts.values()) font.delete();
		for (const typeface of this.glyphRunTypefaces.values()) typeface.delete();
		this.glyphRunFonts.clear();
		this.glyphRunTypefaces.clear();
		this.verifiedFontBlobs.clear();
		this.registeredBlobBytes = 0;
	}
	typefaceFor(face, blob) {
		const cacheKey = this.typefaceCacheKey(face, blob);
		const cached = this.glyphRunTypefaces.get(cacheKey);
		if (cached) return cached;
		if (this.glyphRunTypefaces.size >= MAX_GLYPH_RUN_TYPEFACES) return null;
		const blobBytes = this.verifiedFontBlobs.get(this.fontBlobCacheKey(blob));
		if (!blobBytes) return null;
		const faceBytes = canvasKitFontFaceData(blobBytes, face.faceIndex);
		if (!faceBytes) return null;
		let typeface = null;
		try {
			typeface = this.canvasKit.Typeface.MakeTypefaceFromData(faceBytes.slice(0));
		} catch {
			typeface = null;
		}
		if (!typeface) try {
			typeface = this.canvasKit.Typeface.MakeFreeTypeFaceFromData(faceBytes.slice(0));
		} catch {
			typeface = null;
		}
		if (typeface) this.glyphRunTypefaces.set(cacheKey, typeface);
		return typeface;
	}
	baseReport(run) {
		return {
			replayEligibility: run?.diagnostics?.replayEligibility ?? "notReplayable",
			quality: run?.diagnostics?.quality ?? "omitted"
		};
	}
	fontBlobCacheKey(blob) {
		return `${blob.dataRef?.id ?? blob.id}:${blob.digest?.value ?? "no-digest"}`;
	}
	typefaceCacheKey(face, blob) {
		return `${this.fontBlobCacheKey(blob)}:face=${face.faceIndex}`;
	}
	fontCacheKey(run, face, blob) {
		const instance = run.shapeKey.fontInstance;
		return [
			this.typefaceCacheKey(face, blob),
			String(instance.sizePx),
			instance.syntheticBold ? "bold" : "regular",
			instance.syntheticItalic ? "italic" : "upright"
		].join("|");
	}
};
function drawCanvasKitGlyphRun(canvas, run, font, paint) {
	const glyphs = Uint16Array.from(run.glyphIds);
	const positions = new Float32Array(run.positions.length * 2);
	for (const [index, point] of run.positions.entries()) {
		positions[index * 2] = point.x;
		positions[index * 2 + 1] = point.y;
	}
	const transform = run.placement.runToPage;
	canvas.save();
	try {
		canvas.concat([
			transform.a,
			transform.c,
			transform.e,
			transform.b,
			transform.d,
			transform.f,
			0,
			0,
			1
		]);
		canvas.drawGlyphs(glyphs, positions, 0, run.placement.baselineY ?? 0, font, paint);
		return true;
	} catch {
		return false;
	} finally {
		canvas.restore();
	}
}
function fontBlobPayloadBytes(payload) {
	if (payload instanceof Uint8Array) return payload.byteLength > 0 && payload.byteLength <= MAX_FONT_BLOB_BYTES ? payload : null;
	if (Array.isArray(payload)) {
		if (payload.length === 0 || payload.length > MAX_FONT_BLOB_BYTES || payload.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) return null;
		return Uint8Array.from(payload);
	}
	if (typeof payload !== "string" || payload.length === 0 || payload.length > MAX_ENCODED_FONT_BLOB_LENGTH || payload.length % 4 !== 0 || !BASE64_PAYLOAD.test(payload)) return null;
	try {
		const binary = globalThis.atob(payload);
		if (binary.length === 0 || binary.length > MAX_FONT_BLOB_BYTES) return null;
		const bytes = new Uint8Array(binary.length);
		for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
		return bytes;
	} catch {
		return null;
	}
}
function fontResourceKeyMatches(resourceKey, digest, bytes) {
	const match = FONT_RESOURCE_KEY.exec(resourceKey);
	if (!match || match[2] !== digest) return false;
	const byteLength = Number(match[1]);
	return Number.isSafeInteger(byteLength) && byteLength === bytes.byteLength && bytesToHex(blake3(bytes)) === digest;
}
function glyphRunPaintIsSupported(run) {
	const style = run.paintStyle;
	if (style.color !== void 0 && typeof style.color !== "string" || style.shadeColor !== void 0 && typeof style.shadeColor !== "string" || style.ratio !== void 0 && (!Number.isFinite(style.ratio) || style.ratio <= 0)) return false;
	const ratio = typeof style.ratio === "number" && style.ratio > 0 ? style.ratio : 1;
	const shadeColor = (style.shadeColor ?? "#ffffff").toLowerCase();
	return Math.abs(ratio - 1) <= .001 && (style.underline ?? "none") === "none" && style.strikethrough !== true && (style.outlineType ?? 0) === 0 && (style.shadowType ?? 0) === 0 && style.emboss !== true && style.engrave !== true && style.superscript !== true && style.subscript !== true && (style.emphasisDot ?? 0) === 0 && shadeColor === "#ffffff";
}
//#endregion
//#region src/view/canvaskit/text-variant-selection.ts
function staticSvgPathLayersAreReplayable(layers, makePath) {
	if (layers.length === 0) return false;
	for (const layer of layers) {
		let path = null;
		try {
			path = makePath(layer.pathData);
		} catch {
			return false;
		}
		if (!path) return false;
		path.delete?.();
	}
	return true;
}
function selectLayerTextVariantsForLeaf(ops, canReplayGlyphOutline, canReplayGlyphRun = () => false) {
	const MAX_VARIANT_PARTS = 4096;
	const selected = /* @__PURE__ */ new Set();
	const groups = /* @__PURE__ */ new Map();
	for (const op of ops) {
		const group = "variant" in op ? op.variant?.equivalenceGroup : void 0;
		if (!group) continue;
		const variants = groups.get(group) ?? [];
		variants.push(op);
		groups.set(group, variants);
	}
	for (const variants of groups.values()) {
		const candidates = /* @__PURE__ */ new Map();
		for (const op of variants) {
			if (!("variant" in op) || !op.variant?.variantId) continue;
			const partIndex = op.variant.partIndex ?? 0;
			const partCount = op.variant.partCount ?? 1;
			const declaredKind = op.variant.variantKind ?? op.type;
			const candidate = candidates.get(op.variant.variantId) ?? {
				kind: op.type,
				expectedPartCount: partCount,
				parts: /* @__PURE__ */ new Set(),
				ops: [],
				structurallyValid: true,
				duplicatePart: false,
				fallback: op.variant.isDefaultFallback === true || op.type === "textRun"
			};
			candidate.structurallyValid &&= candidate.kind === op.type && declaredKind === op.type && candidate.expectedPartCount === partCount && Number.isInteger(partCount) && partCount > 0 && partCount <= MAX_VARIANT_PARTS && Number.isInteger(partIndex) && partIndex >= 0 && partIndex < partCount;
			candidate.duplicatePart ||= candidate.parts.has(partIndex);
			candidate.parts.add(partIndex);
			candidate.ops.push(op);
			candidate.fallback ||= op.variant.isDefaultFallback === true || op.type === "textRun";
			candidates.set(op.variant.variantId, candidate);
		}
		const complete = [...candidates.values()].filter((candidate) => candidate.structurallyValid && !candidate.duplicatePart && candidate.parts.size === candidate.expectedPartCount && Array.from({ length: candidate.expectedPartCount }, (_, index) => index).every((index) => candidate.parts.has(index)));
		let chosen;
		for (const kind of ["glyphOutline", "glyphRun"]) {
			chosen = complete.find((candidate) => candidate.kind === kind && !candidate.fallback && candidate.ops.every((op) => op.type === "glyphOutline" ? canReplayGlyphOutline(op) : op.type === "glyphRun" && canReplayGlyphRun(op)));
			if (chosen) break;
		}
		chosen ??= complete.find((candidate) => candidate.kind === "textRun" && candidate.fallback);
		for (const op of chosen?.ops ?? []) selected.add(op);
	}
	return selected;
}
//#endregion
//#region src/view/canvaskit/diagnostics.ts
var EXPECTED_CANVASKIT_UNSUPPORTED_OPS = /* @__PURE__ */ new Set([
	"equation:unsupportedDirectReplay",
	"glyphOutline",
	"glyphOutline:glyphOutlineStrokeStyleUnsupported",
	"glyphOutline:unsupportedBitmapGlyph",
	"glyphOutline:unsupportedColorGlyph",
	"glyphOutline:unsupportedOutlinePayload",
	"glyphOutline:unsupportedSvgGlyph",
	"image:dataMissing",
	"image:dimensionUnavailable",
	"image:invalidBounds",
	"image:tileLimit",
	"imageEffect:blackWhite",
	"imageEffect:brightnessContrast",
	"imageEffect:grayScale",
	"imageEffect:pattern8x8",
	"rawSvg:unsupportedDirectReplay",
	"textRun:emphasisDot",
	"textRun:layoutPositions",
	"textRun:scriptTextRequiresShaping",
	"textRunFont",
	"viewOption:showControlCodes"
]);
function isExpectedCanvasKitUnsupportedOp(op) {
	return EXPECTED_CANVASKIT_UNSUPPORTED_OPS.has(op);
}
//#endregion
//#region src/view/canvaskit/resource-key.ts
var RESOURCE_KEY_PATTERN = /^(img|svg):blake3:(0|[1-9][0-9]*):([0-9a-f]{64})$/;
function layerResourceKeyMatches(expectedKind, resourceKey, bytes) {
	const match = RESOURCE_KEY_PATTERN.exec(resourceKey);
	if (!match || match[1] !== expectedKind) return false;
	const byteLength = Number(match[2]);
	return Number.isSafeInteger(byteLength) && byteLength === bytes.byteLength && bytesToHex(blake3(bytes)) === match[3];
}
//#endregion
//#region src/view/glyph-outline-payload-status.ts
var COLRV1_SUPPORTED_NODE_KINDS = /* @__PURE__ */ new Set([
	"solidPath",
	"linearGradientPath",
	"radialGradientPath",
	"sweepGradientPath",
	"transform"
]);
function glyphOutlinePayloadStatus(op, options = {}) {
	const payloadKind = op.payloadKind ?? "monochromeFill";
	if (!hasExclusivePayloadFamily(op, payloadKind)) return {
		payloadKind,
		supported: false,
		reason: "unsupportedOutlinePayload",
		detail: "mixedPayloadFamily"
	};
	switch (payloadKind) {
		case "monochromeFill": return {
			payloadKind,
			supported: Array.isArray(op.paths) && op.paths.length > 0,
			reason: op.paths?.length ? void 0 : "unsupportedOutlinePayload"
		};
		case "monochromeFillStroke":
			if (!options.allowMonochromeFillStroke) return {
				payloadKind,
				supported: false,
				reason: "glyphOutlineStrokeStyleUnsupported",
				detail: "gateClosed"
			};
			return isStrictStroke(op.stroke) ? {
				payloadKind,
				supported: true
			} : {
				payloadKind,
				supported: false,
				reason: "glyphOutlineStrokeStyleUnsupported"
			};
		case "colorLayers": return colorLayersStatus(op, options);
		case "bitmapGlyph": return options.allowBitmapGlyph && hasBitmapGlyphContract(op) ? {
			payloadKind,
			supported: true
		} : {
			payloadKind,
			supported: false,
			reason: "unsupportedBitmapGlyph"
		};
		case "svgGlyph": return options.allowSvgGlyph && hasSvgGlyphContract(op) ? {
			payloadKind,
			supported: true
		} : {
			payloadKind,
			supported: false,
			reason: "unsupportedSvgGlyph"
		};
		default: return {
			payloadKind,
			supported: false,
			reason: "unsupportedOutlinePayload",
			detail: "unknownPayloadKind"
		};
	}
}
function glyphOutlinePayloadResourceKey(op) {
	const payloadKind = op.payloadKind ?? "monochromeFill";
	if (!hasExclusivePayloadFamily(op, payloadKind)) return null;
	switch (payloadKind) {
		case "colorLayers": return hasColorLayersResourceKeyContract(op) && op.colorLayers ? colorLayersResourceKey(op.colorLayers) : null;
		case "bitmapGlyph": return hasBitmapGlyphContract(op) && op.bitmapGlyph ? bitmapGlyphResourceKey(op.bitmapGlyph) : null;
		case "svgGlyph": return hasSvgGlyphContract(op) && op.svgGlyph ? svgGlyphResourceKey(op.svgGlyph) : null;
		default: return null;
	}
}
function colorLayersStatus(op, options) {
	const payloadKind = "colorLayers";
	const colorLayers = op.colorLayers;
	if (!colorLayers) return {
		payloadKind,
		supported: false,
		reason: "unsupportedColorGlyph",
		detail: "missingColorLayers"
	};
	if (colorLayers.colorFormat === "colrV0") return options.allowColrv0ColorLayers && Array.isArray(colorLayers.layers) && colorLayers.layers.length > 0 ? {
		payloadKind,
		supported: true
	} : {
		payloadKind,
		supported: false,
		reason: "unsupportedColorGlyph",
		detail: "colrV0GateClosed"
	};
	if (colorLayers.colorFormat === "colrV1") {
		const unsupported = (colorLayers.paintGraph?.nodes ?? []).find((node) => !COLRV1_SUPPORTED_NODE_KINDS.has(node.kind ?? ""));
		if (unsupported) return {
			payloadKind,
			supported: false,
			reason: "unsupportedColorGlyph",
			detail: `colrV1Node:${unsupported.kind ?? "unknown"}`
		};
		if (!hasSupportedColrv1GraphContract(op)) return {
			payloadKind,
			supported: false,
			reason: "unsupportedColorGlyph",
			detail: "colrV1InvalidGraph"
		};
		return options.allowColrv1Stage1ColorGraph ? {
			payloadKind,
			supported: true
		} : {
			payloadKind,
			supported: false,
			reason: "unsupportedColorGlyph",
			detail: "colrV1GateClosed"
		};
	}
	return {
		payloadKind,
		supported: false,
		reason: "unsupportedColorGlyph",
		detail: `format:${colorLayers.colorFormat ?? "missing"}`
	};
}
function hasSupportedColrv1GraphContract(op) {
	const colorLayers = op.colorLayers;
	const graph = colorLayers?.paintGraph;
	const nodes = graph?.nodes ?? [];
	const topLevelGlyphRange = colorLayers?.glyphRange;
	if (colorLayers?.colorFormat !== "colrV1" || !graph || nodes.length === 0 || nodes.length > 64 || colorLayers.sourceFontRef === void 0 || !isValidTextRange(colorLayers.sourceRangeUtf8) || !isNonEmptyTextRange(topLevelGlyphRange)) return false;
	const nodesById = /* @__PURE__ */ new Map();
	for (const node of nodes) {
		if (!Number.isInteger(node.nodeId) || node.nodeId === void 0 || nodesById.has(node.nodeId)) return false;
		nodesById.set(node.nodeId, node);
	}
	let nodeId = graph.rootNodeId;
	const visited = /* @__PURE__ */ new Set();
	for (let depth = 0; depth < 64; depth += 1) {
		if (!Number.isInteger(nodeId) || nodeId === void 0 || visited.has(nodeId)) return false;
		visited.add(nodeId);
		const node = nodesById.get(nodeId);
		if (!node) return false;
		switch (node.kind) {
			case "solidPath": return visited.size === nodes.length && node.solidPath !== void 0 && node.transform === void 0 && node.linearGradientPath === void 0 && node.radialGradientPath === void 0 && node.sweepGradientPath === void 0 && isLeafMetadataValid(node) && isValidPathCommands(node.solidPath.commands) && isValidResolvedColor(node.solidPath.fill) && isSupportedFillRule(node.solidPath.fillRule);
			case "linearGradientPath": return visited.size === nodes.length && node.solidPath === void 0 && node.transform === void 0 && node.radialGradientPath === void 0 && node.sweepGradientPath === void 0 && node.linearGradientPath !== void 0 && isLeafMetadataValid(node) && isValidPathCommands(node.linearGradientPath.commands) && Number.isFinite(node.linearGradientPath.gradient?.x0) && Number.isFinite(node.linearGradientPath.gradient?.y0) && Number.isFinite(node.linearGradientPath.gradient?.x1) && Number.isFinite(node.linearGradientPath.gradient?.y1) && isValidColorGradientStops(node.linearGradientPath.gradient?.stops) && isSupportedFillRule(node.linearGradientPath.fillRule);
			case "radialGradientPath": return visited.size === nodes.length && node.solidPath === void 0 && node.transform === void 0 && node.linearGradientPath === void 0 && node.sweepGradientPath === void 0 && node.radialGradientPath !== void 0 && isLeafMetadataValid(node) && isValidPathCommands(node.radialGradientPath.commands) && Number.isFinite(node.radialGradientPath.gradient?.cx) && Number.isFinite(node.radialGradientPath.gradient?.cy) && Number.isFinite(node.radialGradientPath.gradient?.radius) && (node.radialGradientPath.gradient?.radius ?? 0) > 0 && isValidColorGradientStops(node.radialGradientPath.gradient?.stops) && isSupportedFillRule(node.radialGradientPath.fillRule);
			case "sweepGradientPath": return visited.size === nodes.length && node.solidPath === void 0 && node.transform === void 0 && node.linearGradientPath === void 0 && node.radialGradientPath === void 0 && node.sweepGradientPath !== void 0 && isLeafMetadataValid(node) && isValidPathCommands(node.sweepGradientPath.commands) && Number.isFinite(node.sweepGradientPath.gradient?.cx) && Number.isFinite(node.sweepGradientPath.gradient?.cy) && isSupportedFullCircleSweepGradient(node.sweepGradientPath.gradient?.startAngleDegrees, node.sweepGradientPath.gradient?.endAngleDegrees) && isValidColorGradientStops(node.sweepGradientPath.gradient?.stops) && isSupportedFillRule(node.sweepGradientPath.fillRule);
			case "transform":
				if (node.solidPath !== void 0 || node.linearGradientPath !== void 0 || node.radialGradientPath !== void 0 || node.sweepGradientPath !== void 0 || node.transform === void 0 || !Number.isInteger(node.transform.childNodeId) || !isFiniteAffine(node.transform.transform)) return false;
				nodeId = node.transform.childNodeId;
				continue;
			default: return false;
		}
	}
	return false;
}
function hasColorLayersResourceKeyContract(op) {
	const colorLayers = op.colorLayers;
	if (!colorLayers) return false;
	if (colorLayers.colorFormat === "colrV0") return hasColrv0ResolvedLayerContract(colorLayers);
	if (colorLayers.colorFormat === "colrV1") return hasSupportedColrv1GraphContract(op);
	return false;
}
function hasColrv0ResolvedLayerContract(colorLayers) {
	const layers = colorLayers.layers ?? [];
	return colorLayers.colorFormat === "colrV0" && colorLayers.paintGraph === void 0 && layers.length > 0 && layers.every((layer) => isValidPathCommands(layer.commands) && isValidResolvedColor(layer.fill) && isSupportedFillRule(layer.fillRule) && isValidTextRange(layer.sourceRangeUtf8) && isNonEmptyTextRange(layer.glyphRange) && isOptionalFiniteAffine(layer.transformToRun) && (layer.opacity === void 0 || Number.isFinite(layer.opacity)));
}
function isLeafMetadataValid(node) {
	return isValidTextRange(node.sourceRangeUtf8) && isNonEmptyTextRange(node.glyphRange) && node.sourceFontRef !== void 0;
}
function isValidTextRange(range) {
	return range !== void 0 && Number.isInteger(range.start) && Number.isInteger(range.end) && (range.end ?? -1) >= (range.start ?? 0);
}
function isNonEmptyTextRange(range) {
	return isValidTextRange(range) && (range?.end ?? 0) > (range?.start ?? 0);
}
function isFiniteAffine(transform) {
	return transform !== void 0 && Number.isFinite(transform.a) && Number.isFinite(transform.b) && Number.isFinite(transform.c) && Number.isFinite(transform.d) && Number.isFinite(transform.e) && Number.isFinite(transform.f);
}
function isOptionalFiniteAffine(transform) {
	return transform === void 0 || isFiniteAffine(transform);
}
function isValidPathCommands(commands) {
	return Array.isArray(commands) && commands.length > 0;
}
function isValidResolvedColor(color) {
	return Array.isArray(color?.rgba) && color.rgba.length === 4 && color.rgba.every((component) => Number.isFinite(component) && component >= 0 && component <= 1);
}
function isValidColorGradientStops(stops) {
	if (!Array.isArray(stops) || stops.length < 2) return false;
	let previousOffset = Number.NEGATIVE_INFINITY;
	for (const stop of stops) {
		if (!Number.isFinite(stop.offset) || (stop.offset ?? -1) < 0 || (stop.offset ?? 2) > 1 || (stop.offset ?? -1) < previousOffset || !isValidResolvedColor(stop.color)) return false;
		previousOffset = stop.offset ?? previousOffset;
	}
	return true;
}
function isSupportedFullCircleSweepGradient(startAngleDegrees, endAngleDegrees) {
	return Number.isFinite(startAngleDegrees) && Number.isFinite(endAngleDegrees) && (startAngleDegrees ?? 0) < (endAngleDegrees ?? 0) && Math.abs((endAngleDegrees ?? 0) - (startAngleDegrees ?? 0) - 360) <= 1e-9;
}
function isSupportedFillRule(fillRule) {
	return fillRule === "nonzero" || fillRule === "evenodd";
}
function hasExclusivePayloadFamily(op, payloadKind) {
	const families = [
		op.stroke !== void 0,
		op.colorLayers !== void 0,
		op.bitmapGlyph !== void 0,
		op.svgGlyph !== void 0
	].filter(Boolean).length;
	if (payloadKind === "monochromeFill") return families === 0;
	if (payloadKind === "monochromeFillStroke") return op.stroke !== void 0 && families === 1;
	if (payloadKind === "colorLayers") return op.colorLayers !== void 0 && families === 1;
	if (payloadKind === "bitmapGlyph") return op.bitmapGlyph !== void 0 && families === 1;
	if (payloadKind === "svgGlyph") return op.svgGlyph !== void 0 && families === 1;
	return families === 0;
}
function isStrictStroke(stroke) {
	return !!stroke && Number.isFinite(stroke.width) && (stroke.width ?? 0) > 0 && stroke.join === "miter" && stroke.cap === "butt" && Number.isFinite(stroke.miterLimit) && (stroke.miterLimit ?? 0) >= 1 && (stroke.paintOrder === "fillThenStroke" || stroke.paintOrder === "strokeThenFill");
}
function hasBitmapGlyphContract(op) {
	const glyph = op.bitmapGlyph;
	return !!glyph && typeof glyph.imageRef === "number" && glyph.scalingPolicy !== "backendDefault" && glyph.placement !== void 0 && isPositiveBounds(glyph.placement);
}
function hasSvgGlyphContract(op) {
	const glyph = op.svgGlyph;
	return !!glyph && typeof glyph.svgRef === "number" && glyph.staticSanitized === true && glyph.scriptAllowed !== true && glyph.animationAllowed !== true && glyph.externalResourcesAllowed !== true && glyph.interactivityAllowed !== true && glyph.viewBox !== void 0 && isPositiveBounds(glyph.viewBox);
}
function colorLayersResourceKey(colorLayers) {
	const graph = colorLayers.paintGraph;
	const graphKey = graph ? `graph:root:${graph.rootNodeId ?? "-"}:nodes:${(graph.nodes ?? []).map((node) => [
		node.nodeId ?? "-",
		node.kind ?? "-",
		textRangeKey(node.glyphRange),
		fontColorGlyphRefKey(node.sourceFontRef)
	].join(":")).join("|")}` : `layers:${(colorLayers.layers ?? []).map((layer) => [
		layer.layerIndex ?? "-",
		layer.glyphId ?? "-",
		textRangeKey(layer.glyphRange),
		textRangeKey(layer.sourceRangeUtf8),
		fontColorGlyphRefKey(layer.sourceFontRef),
		layer.paletteIndex ?? "-"
	].join(":")).join("|")}`;
	return [
		"glyphPayload:colorLayers",
		`format:${colorLayers.colorFormat ?? "-"}`,
		`source:${fontColorGlyphRefKey(colorLayers.sourceFontRef)}`,
		`palette:${paletteRefKey(colorLayers.paletteRef)}`,
		`range:${textRangeKey(colorLayers.sourceRangeUtf8)}`,
		`glyphRange:${textRangeKey(colorLayers.glyphRange)}`,
		graphKey
	].join(":");
}
function bitmapGlyphResourceKey(glyph) {
	return [
		"glyphPayload:bitmapGlyph",
		`imageRef:${glyph.imageRef ?? "-"}`,
		`range:${textRangeKey(glyph.sourceRangeUtf8)}`,
		`glyphRange:${textRangeKey(glyph.glyphRange)}`,
		`placement:${boundsKey(glyph.placement)}`,
		`alphaPremultiplied:${glyph.alphaPremultiplied === true}`,
		`scaling:${glyph.scalingPolicy ?? "-"}`,
		`filtering:${glyph.filtering ?? "-"}`,
		`transform:${affineKey(glyph.transformToRun)}`
	].join(":");
}
function svgGlyphResourceKey(glyph) {
	return [
		"glyphPayload:svgGlyph",
		`svgRef:${glyph.svgRef ?? "-"}`,
		`range:${textRangeKey(glyph.sourceRangeUtf8)}`,
		`glyphRange:${textRangeKey(glyph.glyphRange)}`,
		`viewBox:${boundsKey(glyph.viewBox)}`,
		`intrinsicSize:${glyph.intrinsicSize ? `${fixed(glyph.intrinsicSize.width)},${fixed(glyph.intrinsicSize.height)}` : "-"}`,
		`staticSanitized:${glyph.staticSanitized === true}`,
		`script:${glyph.scriptAllowed === true}`,
		`animation:${glyph.animationAllowed === true}`,
		`external:${glyph.externalResourcesAllowed === true}`,
		`interactive:${glyph.interactivityAllowed === true}`,
		`transform:${affineKey(glyph.transformToRun)}`
	].join(":");
}
function fontColorGlyphRefKey(ref) {
	if (!ref) return "-";
	return [
		`face:${ref.faceKey ?? "-"}`,
		`glyph:${ref.glyphId ?? "-"}`,
		`palette:${ref.paletteIndex ?? "-"}`,
		`format:${ref.colorFormat ?? "-"}`
	].join(":");
}
function paletteRefKey(ref) {
	if (!ref) return "-";
	return [
		`id:${ref.id ?? "-"}`,
		`index:${ref.index ?? "-"}`,
		`digest:${ref.cpalDigest ?? "-"}`
	].join(":");
}
function textRangeKey(range) {
	return range ? `${range.start ?? "-"}..${range.end ?? "-"}` : "-";
}
function boundsKey(bounds) {
	return bounds ? [
		bounds.x,
		bounds.y,
		bounds.width,
		bounds.height
	].map(fixedBounds).join(",") : "-";
}
function affineKey(transform) {
	return transform ? [
		transform.a,
		transform.b,
		transform.c,
		transform.d,
		transform.e,
		transform.f
	].map(fixed).join(",") : "-";
}
function fixed(value) {
	return Number.isFinite(value) ? (value ?? 0).toFixed(6) : "-";
}
function fixedBounds(value) {
	return Number.isFinite(value) ? (value ?? 0).toFixed(3) : "-";
}
function isPositiveBounds(bounds) {
	return Number.isFinite(bounds.width) && Number.isFinite(bounds.height) && (bounds.width ?? 0) > 0 && (bounds.height ?? 0) > 0;
}
//#endregion
//#region src/view/canvaskit/css-color.ts
var CSS_NAMED_COLORS = {
	aliceblue: "#f0f8ff",
	antiquewhite: "#faebd7",
	aqua: "#00ffff",
	aquamarine: "#7fffd4",
	azure: "#f0ffff",
	beige: "#f5f5dc",
	bisque: "#ffe4c4",
	black: "#000000",
	blanchedalmond: "#ffebcd",
	blue: "#0000ff",
	blueviolet: "#8a2be2",
	brown: "#a52a2a",
	burlywood: "#deb887",
	cadetblue: "#5f9ea0",
	chartreuse: "#7fff00",
	chocolate: "#d2691e",
	coral: "#ff7f50",
	cornflowerblue: "#6495ed",
	cornsilk: "#fff8dc",
	crimson: "#dc143c",
	cyan: "#00ffff",
	darkblue: "#00008b",
	darkcyan: "#008b8b",
	darkgoldenrod: "#b8860b",
	darkgray: "#a9a9a9",
	darkgreen: "#006400",
	darkgrey: "#a9a9a9",
	darkkhaki: "#bdb76b",
	darkmagenta: "#8b008b",
	darkolivegreen: "#556b2f",
	darkorange: "#ff8c00",
	darkorchid: "#9932cc",
	darkred: "#8b0000",
	darksalmon: "#e9967a",
	darkseagreen: "#8fbc8f",
	darkslateblue: "#483d8b",
	darkslategray: "#2f4f4f",
	darkslategrey: "#2f4f4f",
	darkturquoise: "#00ced1",
	darkviolet: "#9400d3",
	deeppink: "#ff1493",
	deepskyblue: "#00bfff",
	dimgray: "#696969",
	dimgrey: "#696969",
	dodgerblue: "#1e90ff",
	firebrick: "#b22222",
	floralwhite: "#fffaf0",
	forestgreen: "#228b22",
	fuchsia: "#ff00ff",
	gainsboro: "#dcdcdc",
	ghostwhite: "#f8f8ff",
	gold: "#ffd700",
	goldenrod: "#daa520",
	gray: "#808080",
	green: "#008000",
	greenyellow: "#adff2f",
	grey: "#808080",
	honeydew: "#f0fff0",
	hotpink: "#ff69b4",
	indianred: "#cd5c5c",
	indigo: "#4b0082",
	ivory: "#fffff0",
	khaki: "#f0e68c",
	lavender: "#e6e6fa",
	lavenderblush: "#fff0f5",
	lawngreen: "#7cfc00",
	lemonchiffon: "#fffacd",
	lightblue: "#add8e6",
	lightcoral: "#f08080",
	lightcyan: "#e0ffff",
	lightgoldenrodyellow: "#fafad2",
	lightgray: "#d3d3d3",
	lightgreen: "#90ee90",
	lightgrey: "#d3d3d3",
	lightpink: "#ffb6c1",
	lightsalmon: "#ffa07a",
	lightseagreen: "#20b2aa",
	lightskyblue: "#87cefa",
	lightslategray: "#778899",
	lightslategrey: "#778899",
	lightsteelblue: "#b0c4de",
	lightyellow: "#ffffe0",
	lime: "#00ff00",
	limegreen: "#32cd32",
	linen: "#faf0e6",
	magenta: "#ff00ff",
	maroon: "#800000",
	mediumaquamarine: "#66cdaa",
	mediumblue: "#0000cd",
	mediumorchid: "#ba55d3",
	mediumpurple: "#9370db",
	mediumseagreen: "#3cb371",
	mediumslateblue: "#7b68ee",
	mediumspringgreen: "#00fa9a",
	mediumturquoise: "#48d1cc",
	mediumvioletred: "#c71585",
	midnightblue: "#191970",
	mintcream: "#f5fffa",
	mistyrose: "#ffe4e1",
	moccasin: "#ffe4b5",
	navajowhite: "#ffdead",
	navy: "#000080",
	oldlace: "#fdf5e6",
	olive: "#808000",
	olivedrab: "#6b8e23",
	orange: "#ffa500",
	orangered: "#ff4500",
	orchid: "#da70d6",
	palegoldenrod: "#eee8aa",
	palegreen: "#98fb98",
	paleturquoise: "#afeeee",
	palevioletred: "#db7093",
	papayawhip: "#ffefd5",
	peachpuff: "#ffdab9",
	peru: "#cd853f",
	pink: "#ffc0cb",
	plum: "#dda0dd",
	powderblue: "#b0e0e6",
	purple: "#800080",
	rebeccapurple: "#663399",
	red: "#ff0000",
	rosybrown: "#bc8f8f",
	royalblue: "#4169e1",
	saddlebrown: "#8b4513",
	salmon: "#fa8072",
	sandybrown: "#f4a460",
	seagreen: "#2e8b57",
	seashell: "#fff5ee",
	sienna: "#a0522d",
	silver: "#c0c0c0",
	skyblue: "#87ceeb",
	slateblue: "#6a5acd",
	slategray: "#708090",
	slategrey: "#708090",
	snow: "#fffafa",
	springgreen: "#00ff7f",
	steelblue: "#4682b4",
	tan: "#d2b48c",
	teal: "#008080",
	thistle: "#d8bfd8",
	tomato: "#ff6347",
	transparent: "#00000000",
	turquoise: "#40e0d0",
	violet: "#ee82ee",
	wheat: "#f5deb3",
	white: "#ffffff",
	whitesmoke: "#f5f5f5",
	yellow: "#ffff00",
	yellowgreen: "#9acd32"
};
function parseSupportedCssColor(color) {
	const normalized = color.trim().toLowerCase();
	const named = CSS_NAMED_COLORS[normalized];
	if (named) return parseHexColor(named);
	const hex = parseHexColor(normalized);
	if (hex) return hex;
	const rgbMatch = normalized.match(/^rgba?\((.*)\)$/);
	if (rgbMatch) return parseRgbColorFunction(rgbMatch[1]);
	const hslMatch = normalized.match(/^hsla?\((.*)\)$/);
	if (hslMatch) return parseHslColorFunction(hslMatch[1]);
	const hwbMatch = normalized.match(/^hwb\((.*)\)$/);
	if (hwbMatch) {
		const [colorBody, slashAlpha] = hwbMatch[1].split("/").map((part) => part.trim());
		const parts = colorBody.includes(",") ? colorBody.split(",").map((part) => part.trim()).filter((part) => part.length > 0) : colorBody.split(/\s+/).filter((part) => part.length > 0);
		if (parts.length < 3 || parts.length > 4) return null;
		const hue = parseCssHue(parts[0]);
		const whiteness = parseCssPercent(parts[1]);
		const blackness = parseCssPercent(parts[2]);
		const alpha = parseCssAlpha(slashAlpha ?? parts[3] ?? "1");
		if (hue === null || whiteness === null || blackness === null || alpha === null) return null;
		const sum = whiteness + blackness;
		if (sum >= 1) {
			const gray = whiteness / sum;
			return [
				gray,
				gray,
				gray,
				alpha
			];
		}
		const [baseRed, baseGreen, baseBlue] = hslToRgb(hue, 1, .5);
		const multiplier = 1 - whiteness - blackness;
		return [
			baseRed * multiplier + whiteness,
			baseGreen * multiplier + whiteness,
			baseBlue * multiplier + whiteness,
			alpha
		];
	}
	const colorMatch = normalized.match(/^color\((.*)\)$/);
	if (colorMatch) {
		const [colorBody, slashAlpha] = colorMatch[1].split("/").map((part) => part.trim());
		const parts = colorBody.split(/\s+/).filter((part) => part.length > 0);
		if (parts.length !== 4 || ![
			"srgb",
			"srgb-linear",
			"display-p3",
			"a98-rgb",
			"prophoto-rgb",
			"rec2020",
			"xyz",
			"xyz-d50",
			"xyz-d65"
		].includes(parts[0])) return null;
		const channels = parts.slice(1).map((part) => {
			if (part.endsWith("%")) return parseCssPercent(part);
			const number = Number(part);
			return Number.isFinite(number) ? clampCanvasKitUnit(number) : null;
		});
		const alpha = parseCssAlpha(slashAlpha ?? "1");
		if (channels.some((channel) => channel === null) || alpha === null) return null;
		const red = channels[0] ?? 0;
		const green = channels[1] ?? 0;
		const blue = channels[2] ?? 0;
		if (parts[0] === "srgb") return [
			red,
			green,
			blue,
			alpha
		];
		if (parts[0] === "srgb-linear") return [
			linearSrgbToEncodedUnit(red),
			linearSrgbToEncodedUnit(green),
			linearSrgbToEncodedUnit(blue),
			alpha
		];
		if (parts[0] === "xyz-d50") return [...xyzD65ToEncodedSrgb(...d50ToD65Xyz(red, green, blue)), alpha];
		if (parts[0] === "xyz" || parts[0] === "xyz-d65") return [...xyzD65ToEncodedSrgb(red, green, blue), alpha];
		if (parts[0] === "a98-rgb") {
			const linearA98Red = red ** (563 / 256);
			const linearA98Green = green ** (563 / 256);
			const linearA98Blue = blue ** (563 / 256);
			return [...xyzD65ToEncodedSrgb(.5766690429 * linearA98Red + .1855582379 * linearA98Green + .1882286462 * linearA98Blue, .2973449753 * linearA98Red + .6273635663 * linearA98Green + .0752914585 * linearA98Blue, .0270313614 * linearA98Red + .0706888525 * linearA98Green + .9913375368 * linearA98Blue), alpha];
		}
		if (parts[0] === "prophoto-rgb") {
			const linearProPhotoRed = red <= .03125 ? red / 16 : red ** 1.8;
			const linearProPhotoGreen = green <= .03125 ? green / 16 : green ** 1.8;
			const linearProPhotoBlue = blue <= .03125 ? blue / 16 : blue ** 1.8;
			return [...xyzD65ToEncodedSrgb(...d50ToD65Xyz(.7977666449 * linearProPhotoRed + .1351812974 * linearProPhotoGreen + .0313477341 * linearProPhotoBlue, .2880748288 * linearProPhotoRed + .7118352342 * linearProPhotoGreen + 899369e-10 * linearProPhotoBlue, .8251046025 * linearProPhotoBlue)), alpha];
		}
		if (parts[0] === "rec2020") {
			const alphaRec2020 = 1.0992968268;
			const betaRec2020 = .0180539685;
			const linearRec2020Red = red < betaRec2020 * 4.5 ? red / 4.5 : ((red + alphaRec2020 - 1) / alphaRec2020) ** (1 / .45);
			const linearRec2020Green = green < betaRec2020 * 4.5 ? green / 4.5 : ((green + alphaRec2020 - 1) / alphaRec2020) ** (1 / .45);
			const linearRec2020Blue = blue < betaRec2020 * 4.5 ? blue / 4.5 : ((blue + alphaRec2020 - 1) / alphaRec2020) ** (1 / .45);
			return [...xyzD65ToEncodedSrgb(.6369580483 * linearRec2020Red + .1446169036 * linearRec2020Green + .1688809752 * linearRec2020Blue, .262700212 * linearRec2020Red + .6779980715 * linearRec2020Green + .0593017165 * linearRec2020Blue, .028072693 * linearRec2020Green + 1.0609850577 * linearRec2020Blue), alpha];
		}
		const linearP3Red = red <= .04045 ? red / 12.92 : ((red + .055) / 1.055) ** 2.4;
		const linearP3Green = green <= .04045 ? green / 12.92 : ((green + .055) / 1.055) ** 2.4;
		const linearP3Blue = blue <= .04045 ? blue / 12.92 : ((blue + .055) / 1.055) ** 2.4;
		return [...xyzD65ToEncodedSrgb(.4865709486 * linearP3Red + .2656676932 * linearP3Green + .1982172852 * linearP3Blue, .2289745641 * linearP3Red + .6917385218 * linearP3Green + .0792869141 * linearP3Blue, .0451133819 * linearP3Green + 1.0439443689 * linearP3Blue), alpha];
	}
	const labMatch = normalized.match(/^lab\((.*)\)$/);
	if (labMatch) {
		const [colorBody, slashAlpha] = labMatch[1].split("/").map((part) => part.trim());
		const parts = colorBody.split(/\s+/).filter((part) => part.length > 0);
		if (parts.length !== 3) return null;
		const lightness = parseCssLabLightness(parts[0]);
		const axisA = Number(parts[1]);
		const axisB = Number(parts[2]);
		const alpha = parseCssAlpha(slashAlpha ?? "1");
		if (lightness === null || !Number.isFinite(axisA) || !Number.isFinite(axisB) || alpha === null) return null;
		const [red, green, blue] = labToRgb(lightness, axisA, axisB);
		return [
			red,
			green,
			blue,
			alpha
		];
	}
	const lchMatch = normalized.match(/^lch\((.*)\)$/);
	if (lchMatch) {
		const [colorBody, slashAlpha] = lchMatch[1].split("/").map((part) => part.trim());
		const parts = colorBody.split(/\s+/).filter((part) => part.length > 0);
		if (parts.length !== 3) return null;
		const lightness = parseCssLabLightness(parts[0]);
		const chroma = Number(parts[1]);
		const hue = parseCssHue(parts[2]);
		const alpha = parseCssAlpha(slashAlpha ?? "1");
		if (lightness === null || !Number.isFinite(chroma) || hue === null || alpha === null) return null;
		const hueRadians = hue * (Math.PI / 180);
		const [red, green, blue] = labToRgb(lightness, chroma * Math.cos(hueRadians), chroma * Math.sin(hueRadians));
		return [
			red,
			green,
			blue,
			alpha
		];
	}
	const oklabMatch = normalized.match(/^oklab\((.*)\)$/);
	if (oklabMatch) {
		const [colorBody, slashAlpha] = oklabMatch[1].split("/").map((part) => part.trim());
		const parts = colorBody.split(/\s+/).filter((part) => part.length > 0);
		if (parts.length !== 3) return null;
		const lightness = parts[0].endsWith("%") ? parseCssPercent(parts[0]) : Number(parts[0]);
		const axisA = Number(parts[1]);
		const axisB = Number(parts[2]);
		const alpha = parseCssAlpha(slashAlpha ?? "1");
		if (lightness === null || !Number.isFinite(lightness) || !Number.isFinite(axisA) || !Number.isFinite(axisB) || alpha === null) return null;
		const [red, green, blue] = oklabToRgb(lightness, axisA, axisB);
		return [
			red,
			green,
			blue,
			alpha
		];
	}
	const oklchMatch = normalized.match(/^oklch\((.*)\)$/);
	if (oklchMatch) {
		const [colorBody, slashAlpha] = oklchMatch[1].split("/").map((part) => part.trim());
		const parts = colorBody.split(/\s+/).filter((part) => part.length > 0);
		if (parts.length !== 3) return null;
		const lightness = parts[0].endsWith("%") ? parseCssPercent(parts[0]) : Number(parts[0]);
		const chroma = Number(parts[1]);
		const hue = parseCssHue(parts[2]);
		const alpha = parseCssAlpha(slashAlpha ?? "1");
		if (lightness === null || !Number.isFinite(lightness) || !Number.isFinite(chroma) || hue === null || alpha === null) return null;
		const hueRadians = hue * (Math.PI / 180);
		const [red, green, blue] = oklabToRgb(lightness, chroma * Math.cos(hueRadians), chroma * Math.sin(hueRadians));
		return [
			red,
			green,
			blue,
			alpha
		];
	}
	return null;
}
function parseHexColor(color) {
	const match = color.match(/^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
	if (!match) return null;
	const hex = match[1];
	const components = hex.length <= 4 ? [...hex].map((component) => Number.parseInt(`${component}${component}`, 16)) : hex.match(/../g)?.map((component) => Number.parseInt(component, 16));
	if (!components || components.some((component) => !Number.isFinite(component))) return null;
	return [
		components[0] / 255,
		components[1] / 255,
		components[2] / 255,
		(components[3] ?? 255) / 255
	];
}
function parseRgbColorFunction(body) {
	const [colorBody, slashAlpha] = body.split("/").map((part) => part.trim());
	const parts = colorBody.includes(",") ? colorBody.split(",").map((part) => part.trim()).filter((part) => part.length > 0) : colorBody.split(/\s+/).filter((part) => part.length > 0);
	if (parts.length < 3 || parts.length > 4) return null;
	const red = parseRgbChannel(parts[0]);
	const green = parseRgbChannel(parts[1]);
	const blue = parseRgbChannel(parts[2]);
	const alpha = parseCssAlpha(slashAlpha ?? parts[3] ?? "1");
	if (red === null || green === null || blue === null || alpha === null) return null;
	return [
		red,
		green,
		blue,
		alpha
	];
}
function parseHslColorFunction(body) {
	const [colorBody, slashAlpha] = body.split("/").map((part) => part.trim());
	const parts = colorBody.includes(",") ? colorBody.split(",").map((part) => part.trim()).filter((part) => part.length > 0) : colorBody.split(/\s+/).filter((part) => part.length > 0);
	if (parts.length < 3 || parts.length > 4) return null;
	const hue = parseCssHue(parts[0]);
	const saturation = parseCssPercent(parts[1]);
	const lightness = parseCssPercent(parts[2]);
	const alpha = parseCssAlpha(slashAlpha ?? parts[3] ?? "1");
	if (hue === null || saturation === null || lightness === null || alpha === null) return null;
	const [red, green, blue] = hslToRgb(hue, saturation, lightness);
	return [
		red,
		green,
		blue,
		alpha
	];
}
function parseCssHue(value) {
	const match = value.trim().match(/^([-+]?(?:\d+|\d*\.\d+))(deg|grad|rad|turn)?$/);
	if (!match) return null;
	const amount = Number(match[1]);
	if (!Number.isFinite(amount)) return null;
	switch (match[2]) {
		case void 0:
		case "deg": return amount;
		case "grad": return amount * .9;
		case "rad": return amount * (180 / Math.PI);
		case "turn": return amount * 360;
		default: return null;
	}
}
function parseRgbChannel(value) {
	const trimmed = value.trim();
	if (trimmed.endsWith("%")) return parseCssPercent(trimmed);
	const number = Number(trimmed);
	return Number.isFinite(number) ? clampCanvasKitUnit(number / 255) : null;
}
function parseCssAlpha(value) {
	const trimmed = value.trim();
	if (trimmed.endsWith("%")) return parseCssPercent(trimmed);
	const number = Number(trimmed);
	return Number.isFinite(number) ? clampCanvasKitUnit(number) : null;
}
function parseCssPercent(value) {
	const trimmed = value.trim();
	if (!trimmed.endsWith("%")) return null;
	const number = Number(trimmed.slice(0, -1).trim());
	return Number.isFinite(number) ? clampCanvasKitUnit(number / 100) : null;
}
function parseCssLabLightness(value) {
	const trimmed = value.trim();
	if (trimmed.endsWith("%")) {
		const percent = parseCssPercent(trimmed);
		return percent === null ? null : percent * 100;
	}
	const number = Number(trimmed);
	return Number.isFinite(number) ? number : null;
}
function hslToRgb(hueDegrees, saturation, lightness) {
	const hue = (hueDegrees % 360 + 360) % 360;
	const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
	const second = chroma * (1 - Math.abs(hue / 60 % 2 - 1));
	const match = lightness - chroma / 2;
	let red = 0;
	let green = 0;
	let blue = 0;
	if (hue < 60) {
		red = chroma;
		green = second;
	} else if (hue < 120) {
		red = second;
		green = chroma;
	} else if (hue < 180) {
		green = chroma;
		blue = second;
	} else if (hue < 240) {
		green = second;
		blue = chroma;
	} else if (hue < 300) {
		red = second;
		blue = chroma;
	} else {
		red = chroma;
		blue = second;
	}
	return [
		red + match,
		green + match,
		blue + match
	];
}
function labToRgb(lightness, axisA, axisB) {
	const normalizedY = (lightness + 16) / 116;
	const normalizedX = normalizedY + axisA / 500;
	const normalizedZ = normalizedY - axisB / 200;
	const epsilon = 216 / 24389;
	const kappa = 24389 / 27;
	const [xD65, yD65, zD65] = d50ToD65Xyz(.96422 * (normalizedX ** 3 > epsilon ? normalizedX ** 3 : (116 * normalizedX - 16) / kappa), 1 * (normalizedY ** 3 > epsilon ? normalizedY ** 3 : (116 * normalizedY - 16) / kappa), .82521 * (normalizedZ ** 3 > epsilon ? normalizedZ ** 3 : (116 * normalizedZ - 16) / kappa));
	return xyzD65ToEncodedSrgb(xD65, yD65, zD65);
}
function d50ToD65Xyz(xD50, yD50, zD50) {
	return [
		.9555766 * xD50 - .0230393 * yD50 + .0631636 * zD50,
		-.0282895 * xD50 + 1.0099416 * yD50 + .0210077 * zD50,
		.0122982 * xD50 - .020483 * yD50 + 1.3299098 * zD50
	];
}
function xyzD65ToEncodedSrgb(xD65, yD65, zD65) {
	return [
		3.2404542 * xD65 - 1.5371385 * yD65 - .4985314 * zD65,
		-.969266 * xD65 + 1.8760108 * yD65 + .041556 * zD65,
		.0556434 * xD65 - .2040259 * yD65 + 1.0572252 * zD65
	].map(linearSrgbToEncodedUnit);
}
function oklabToRgb(lightness, axisA, axisB) {
	const long = lightness + .3963377774 * axisA + .2158037573 * axisB;
	const medium = lightness - .1055613458 * axisA - .0638541728 * axisB;
	const short = lightness - .0894841775 * axisA - 1.291485548 * axisB;
	const longCubed = long * long * long;
	const mediumCubed = medium * medium * medium;
	const shortCubed = short * short * short;
	return [
		4.0767416621 * longCubed - 3.3077115913 * mediumCubed + .2309699292 * shortCubed,
		-1.2684380046 * longCubed + 2.6097574011 * mediumCubed - .3413193965 * shortCubed,
		-.0041960863 * longCubed - .7034186147 * mediumCubed + 1.707614701 * shortCubed
	].map(linearSrgbToEncodedUnit);
}
function linearSrgbToEncodedUnit(channel) {
	return clampCanvasKitUnit(channel <= .0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - .055);
}
function clampCanvasKitUnit(value) {
	return Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}
//#endregion
//#region src/view/static-svg-path-layers.ts
var STATIC_SVG_UNSUPPORTED_INDIRECT_PAINT_VALUES = /* @__PURE__ */ new Set([
	"context-fill",
	"context-stroke",
	"inherit",
	"initial",
	"revert",
	"revert-layer",
	"unset"
]);
function parseStaticSvgPathLayers(fragment, currentColor = "#000000") {
	return parseStaticSvgFragmentLayers(fragment, currentColor).paths;
}
function parseStaticSvgFragmentLayers(fragment, currentColor) {
	const parserFragment = staticSvgMarkupWithoutComments(fragment);
	if (parserFragment === null || hasStaticSvgUnsupportedMarkup(parserFragment)) return {
		paths: [],
		texts: []
	};
	const paths = [];
	const texts = [];
	const paintStateStack = [{
		color: currentColor,
		fill: null,
		fillRuleValue: null,
		fillOpacity: 1,
		stroke: null,
		strokeOpacity: 1,
		strokeWidth: 1,
		strokeLineJoin: "miter",
		strokeLineCap: "butt",
		strokeMiterLimit: 4,
		strokeDashArray: null,
		strokeDashOffset: 0,
		fontFamily: "sans-serif",
		fontSize: 12,
		fontWeight: "normal",
		fontStyle: "normal",
		textAnchor: "start",
		dominantBaseline: "alphabetic"
	}];
	const tagPattern = /<\s*(\/?)\s*([A-Za-z][A-Za-z0-9:-]*)\b([^>]*)>/g;
	let ignoredElementDepth = 0;
	let openText = null;
	for (const match of parserFragment.matchAll(tagPattern)) {
		const isClosingTag = match[1] === "/";
		const elementName = match[2].toLowerCase();
		const rawAttributes = match[3] ?? "";
		if (isClosingTag) {
			if (openText) {
				if (elementName !== "text") return {
					paths: [],
					texts: []
				};
				const textLayer = staticSvgTextLayer(parserFragment.slice(openText.contentStart, match.index), openText.attributes, openText.state);
				if (textLayer) texts.push(textLayer);
				openText = null;
				continue;
			}
			if (ignoredElementDepth > 0) {
				ignoredElementDepth -= 1;
				continue;
			}
			if ((elementName === "svg" || elementName === "g") && paintStateStack.length > 1) paintStateStack.pop();
			continue;
		}
		if (openText) return {
			paths: [],
			texts: []
		};
		const supportedAttributes = staticSvgSupportedAttributes(elementName);
		if (!supportedAttributes) return {
			paths: [],
			texts: []
		};
		const isSelfClosing = /\/\s*$/.test(rawAttributes);
		const attributes = /* @__PURE__ */ new Map();
		const attributePattern = /([A-Za-z_][A-Za-z0-9:._-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
		let remainingAttributes = rawAttributes;
		for (const attributeMatch of rawAttributes.matchAll(attributePattern)) {
			const rawName = attributeMatch[1].trim().toLowerCase();
			if (attributes.has(rawName)) return {
				paths: [],
				texts: []
			};
			const decodedValue = decodeStaticSvgXmlEntities(attributeMatch[2] ?? attributeMatch[3] ?? attributeMatch[4] ?? "");
			if (decodedValue === null) return {
				paths: [],
				texts: []
			};
			attributes.set(rawName, decodedValue.trim());
			remainingAttributes = remainingAttributes.replace(attributeMatch[0], "");
		}
		if (remainingAttributes.replace(/\/\s*$/, "").trim().length > 0) return {
			paths: [],
			texts: []
		};
		for (const [name, value] of attributes) if (!isStaticSvgAttributeSupported(elementName, supportedAttributes, name, value)) return {
			paths: [],
			texts: []
		};
		if (ignoredElementDepth > 0 || elementName === "defs" || elementName === "title" || elementName === "desc" || elementName === "metadata") {
			if (!isSelfClosing) ignoredElementDepth += 1;
			continue;
		}
		if (elementName === "svg" || elementName === "g") {
			if (!isSelfClosing) paintStateStack.push(staticSvgPaintStateFromMap(paintStateStack[paintStateStack.length - 1], attributes, true));
			continue;
		}
		if (elementName === "text") {
			if (isSelfClosing) continue;
			openText = {
				attributes,
				state: paintStateStack[paintStateStack.length - 1],
				contentStart: (match.index ?? 0) + match[0].length
			};
			continue;
		}
		let pathData = null;
		if (elementName === "path") pathData = attributes.get("d")?.trim() || null;
		else if (elementName === "circle") {
			const cx = svgNumber(attributes.get("cx") ?? "0") ?? 0;
			const cy = svgNumber(attributes.get("cy") ?? "0") ?? 0;
			const r = attributes.has("r") ? svgNumber(attributes.get("r") ?? "") : null;
			if (r !== null && r > 0) pathData = `M${cx - r} ${cy}A${r} ${r} 0 1 0 ${cx + r} ${cy}A${r} ${r} 0 1 0 ${cx - r} ${cy}Z`;
		} else if (elementName === "ellipse") {
			const cx = svgNumber(attributes.get("cx") ?? "0") ?? 0;
			const cy = svgNumber(attributes.get("cy") ?? "0") ?? 0;
			const rx = attributes.has("rx") ? svgNumber(attributes.get("rx") ?? "") : null;
			const ry = attributes.has("ry") ? svgNumber(attributes.get("ry") ?? "") : null;
			if (rx !== null && ry !== null && rx > 0 && ry > 0) pathData = `M${cx - rx} ${cy}A${rx} ${ry} 0 1 0 ${cx + rx} ${cy}A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}Z`;
		} else if (elementName === "polygon" || elementName === "polyline") {
			const points = svgPointList(attributes.get("points") ?? "");
			if (points.length >= 3) {
				const [first, ...rest] = points;
				const closePath = elementName === "polygon" ? "Z" : "";
				pathData = `M${first[0]} ${first[1]}${rest.map(([x, y]) => `L${x} ${y}`).join("")}${closePath}`;
			}
		} else if (elementName === "line") pathData = `M${svgNumber(attributes.get("x1") ?? "0") ?? 0} ${svgNumber(attributes.get("y1") ?? "0") ?? 0}L${svgNumber(attributes.get("x2") ?? "0") ?? 0} ${svgNumber(attributes.get("y2") ?? "0") ?? 0}`;
		else if (elementName === "rect") pathData = staticSvgRectPathData(svgNumber(attributes.get("x") ?? "0") ?? 0, svgNumber(attributes.get("y") ?? "0") ?? 0, attributes.has("width") ? svgNumber(attributes.get("width") ?? "") : null, attributes.has("height") ? svgNumber(attributes.get("height") ?? "") : null, attributes.has("rx") ? svgNumber(attributes.get("rx") ?? "") : null, attributes.has("ry") ? svgNumber(attributes.get("ry") ?? "") : null);
		if (!pathData) continue;
		const currentState = paintStateStack[paintStateStack.length - 1];
		const fill = staticSvgMapPresentationAttribute(attributes, "fill");
		const strokeValue = staticSvgMapPresentationAttribute(attributes, "stroke");
		const opacityValue = staticSvgMapPresentationAttribute(attributes, "opacity");
		const fillOpacityValue = staticSvgMapPresentationAttribute(attributes, "fill-opacity");
		const strokeOpacityValue = staticSvgMapPresentationAttribute(attributes, "stroke-opacity");
		const shapeColor = staticSvgMapPresentationAttribute(attributes, "color") ?? currentState.color;
		const strokeWidthValue = staticSvgMapPresentationAttribute(attributes, "stroke-width");
		const strokeLineJoinValue = staticSvgMapPresentationAttribute(attributes, "stroke-linejoin");
		const strokeLineCapValue = staticSvgMapPresentationAttribute(attributes, "stroke-linecap");
		const strokeMiterLimitValue = staticSvgMapPresentationAttribute(attributes, "stroke-miterlimit");
		const strokeDashArrayValue = staticSvgMapPresentationAttribute(attributes, "stroke-dasharray");
		const strokeDashOffsetValue = staticSvgMapPresentationAttribute(attributes, "stroke-dashoffset");
		const fillRuleValue = staticSvgMapPresentationAttribute(attributes, "fill-rule") ?? currentState.fillRuleValue;
		const resolvedFill = resolveStaticSvgPaintValue(fill ?? currentState.fill ?? "#000000", shapeColor);
		const resolvedStroke = strokeValue ?? currentState.stroke;
		const shapeOpacity = svgOpacity(opacityValue);
		const stroke = staticSvgStrokeLayer(resolvedStroke, strokeWidthValue, strokeOpacityValue, strokeLineJoinValue, strokeLineCapValue, strokeMiterLimitValue, strokeDashArrayValue, strokeDashOffsetValue, currentState, shapeOpacity, shapeColor);
		const shouldFill = elementName !== "line" && resolvedFill.trim().toLowerCase() !== "none";
		const transform = staticSvgComposeTransforms(currentState.transform, parseStaticSvgTransform(attributes.get("transform")));
		paths.push({
			pathData,
			fill: shouldFill ? resolvedFill : null,
			fillRule: svgFillRule(fillRuleValue),
			opacity: shapeOpacity * (fillOpacityValue === null ? currentState.fillOpacity : svgOpacity(fillOpacityValue)),
			stroke,
			transform
		});
	}
	if (openText) return {
		paths: [],
		texts: []
	};
	return {
		paths,
		texts
	};
}
function staticSvgMarkupWithoutComments(fragment) {
	let stripped = "";
	let cursor = 0;
	while (cursor < fragment.length) {
		const commentStart = fragment.indexOf("<!--", cursor);
		const strayCommentEnd = fragment.indexOf("-->", cursor);
		if (strayCommentEnd !== -1 && (commentStart === -1 || strayCommentEnd < commentStart)) return null;
		if (commentStart === -1) return stripped + fragment.slice(cursor);
		stripped += fragment.slice(cursor, commentStart);
		const commentEnd = fragment.indexOf("-->", commentStart + 4);
		if (commentEnd === -1) return null;
		if (fragment.slice(commentStart + 4, commentEnd).includes("--")) return null;
		cursor = commentEnd + 3;
	}
	return stripped;
}
function staticSvgStyleWithoutComments(style) {
	let stripped = "";
	let cursor = 0;
	while (cursor < style.length) {
		const commentStart = style.indexOf("/*", cursor);
		const strayCommentEnd = style.indexOf("*/", cursor);
		if (strayCommentEnd !== -1 && (commentStart === -1 || strayCommentEnd < commentStart)) return null;
		if (commentStart === -1) return stripped + style.slice(cursor);
		stripped += `${style.slice(cursor, commentStart)} `;
		const commentEnd = style.indexOf("*/", commentStart + 2);
		if (commentEnd === -1) return null;
		cursor = commentEnd + 2;
	}
	return stripped;
}
function decodeStaticSvgXmlEntities(value) {
	let decodedValue = "";
	let cursor = 0;
	while (cursor < value.length) {
		const entityStart = value.indexOf("&", cursor);
		if (entityStart < 0) return decodedValue + value.slice(cursor);
		decodedValue += value.slice(cursor, entityStart);
		const entityEnd = value.indexOf(";", entityStart + 1);
		if (entityEnd < 0) return null;
		const entity = value.slice(entityStart + 1, entityEnd);
		let decodedEntity = null;
		if (entity === "amp") decodedEntity = "&";
		else if (entity === "lt") decodedEntity = "<";
		else if (entity === "gt") decodedEntity = ">";
		else if (entity === "quot") decodedEntity = "\"";
		else if (entity === "apos") decodedEntity = "'";
		else {
			const decimalEntity = /^#([0-9]+)$/.exec(entity);
			const hexEntity = /^#x([0-9a-fA-F]+)$/.exec(entity);
			const codePoint = decimalEntity ? Number(decimalEntity[1]) : hexEntity ? Number.parseInt(hexEntity[1], 16) : NaN;
			const isXmlCharacter = codePoint === 9 || codePoint === 10 || codePoint === 13 || codePoint >= 32 && codePoint <= 55295 || codePoint >= 57344 && codePoint <= 65533 || codePoint >= 65536 && codePoint <= 1114111;
			if (Number.isInteger(codePoint) && isXmlCharacter) decodedEntity = String.fromCodePoint(codePoint);
		}
		if (decodedEntity === null) return null;
		decodedValue += decodedEntity;
		cursor = entityEnd + 1;
	}
	return decodedValue;
}
function isStaticSvgTextContentSupported(text) {
	return !text.includes("<") && decodeStaticSvgXmlEntities(text) !== null;
}
function hasStaticSvgUnsupportedMarkup(fragment) {
	if (/<\s*\?/.test(fragment) || /<\s*!(?!\s*--)/.test(fragment) || fragment.includes("]]>")) return true;
	const openElementStack = [];
	const tagPattern = /<\s*(\/?)\s*([A-Za-z][A-Za-z0-9:-]*)\b([^>]*)>/g;
	let cursor = 0;
	for (const match of fragment.matchAll(tagPattern)) {
		if (!isStaticSvgTextContentSupported(fragment.slice(cursor, match.index))) return true;
		cursor = (match.index ?? 0) + match[0].length;
		const isClosingTag = match[1] === "/";
		const elementName = match[2].toLowerCase();
		const trailingContent = match[3] ?? "";
		if (!staticSvgSupportedAttributes(elementName)) return true;
		if (isClosingTag) {
			if (trailingContent.trim().length > 0 || openElementStack.pop() !== elementName) return true;
			continue;
		}
		if (!/\/\s*$/.test(trailingContent)) openElementStack.push(elementName);
	}
	return openElementStack.length > 0 || !isStaticSvgTextContentSupported(fragment.slice(cursor));
}
function staticSvgMapPresentationAttribute(attributes, name) {
	const style = attributes.get("style");
	if (style) {
		const normalizedStyle = staticSvgStyleWithoutComments(style);
		let styleValue = null;
		for (const declaration of (normalizedStyle ?? "").split(";")) {
			const separator = declaration.indexOf(":");
			if (separator < 0) continue;
			if (declaration.slice(0, separator).trim().toLowerCase() === name.toLowerCase()) styleValue = declaration.slice(separator + 1).trim();
		}
		if (styleValue !== null) return styleValue;
	}
	return attributes.get(name) ?? null;
}
function staticSvgPaintStateFromMap(parent, attributes, allowTransform) {
	const fillOpacityValue = staticSvgMapPresentationAttribute(attributes, "fill-opacity");
	const strokeDashArray = svgStrokeDashArray(staticSvgMapPresentationAttribute(attributes, "stroke-dasharray"));
	const strokeDashOffset = svgStrokeDashOffset(staticSvgMapPresentationAttribute(attributes, "stroke-dashoffset"));
	return {
		color: staticSvgMapPresentationAttribute(attributes, "color") ?? parent.color,
		fill: staticSvgMapPresentationAttribute(attributes, "fill") ?? parent.fill,
		fillRuleValue: staticSvgMapPresentationAttribute(attributes, "fill-rule") ?? parent.fillRuleValue,
		fillOpacity: fillOpacityValue === null ? parent.fillOpacity : svgOpacity(fillOpacityValue),
		stroke: staticSvgMapPresentationAttribute(attributes, "stroke") ?? parent.stroke,
		strokeOpacity: staticSvgMapPresentationAttribute(attributes, "stroke-opacity") === null ? parent.strokeOpacity : svgOpacity(staticSvgMapPresentationAttribute(attributes, "stroke-opacity")),
		strokeWidth: svgNonNegativeNumber(staticSvgMapPresentationAttribute(attributes, "stroke-width")) ?? parent.strokeWidth,
		strokeLineJoin: svgStrokeLineJoin(staticSvgMapPresentationAttribute(attributes, "stroke-linejoin")) ?? parent.strokeLineJoin,
		strokeLineCap: svgStrokeLineCap(staticSvgMapPresentationAttribute(attributes, "stroke-linecap")) ?? parent.strokeLineCap,
		strokeMiterLimit: svgPositiveNumber(staticSvgMapPresentationAttribute(attributes, "stroke-miterlimit")) ?? parent.strokeMiterLimit,
		strokeDashArray: strokeDashArray === void 0 ? parent.strokeDashArray : strokeDashArray,
		strokeDashOffset: strokeDashOffset === void 0 ? parent.strokeDashOffset : strokeDashOffset,
		fontFamily: svgFontFamily(staticSvgMapPresentationAttribute(attributes, "font-family")) ?? parent.fontFamily,
		fontSize: svgPositiveNumber(staticSvgMapPresentationAttribute(attributes, "font-size")) ?? parent.fontSize,
		fontWeight: svgFontWeight(staticSvgMapPresentationAttribute(attributes, "font-weight")) ?? parent.fontWeight,
		fontStyle: svgFontStyle(staticSvgMapPresentationAttribute(attributes, "font-style")) ?? parent.fontStyle,
		textAnchor: svgTextAnchor(staticSvgMapPresentationAttribute(attributes, "text-anchor")) ?? parent.textAnchor,
		dominantBaseline: svgDominantBaseline(staticSvgMapPresentationAttribute(attributes, "dominant-baseline")) ?? parent.dominantBaseline,
		transform: allowTransform ? staticSvgComposeTransforms(parent.transform, parseStaticSvgTransform(attributes.get("transform"))) : parent.transform
	};
}
function staticSvgTextLayer(rawText, attributes, parentState) {
	const decodedText = decodeStaticSvgXmlEntities(rawText);
	if (decodedText === null) return null;
	const text = decodedText.replace(/\s+/g, " ").trim();
	if (text.length === 0) return null;
	const state = staticSvgPaintStateFromMap(parentState, attributes, true);
	const x = svgNumber(attributes.get("x") ?? "0") ?? 0;
	const y = svgNumber(attributes.get("y") ?? "0") ?? 0;
	const opacity = svgOpacity(staticSvgMapPresentationAttribute(attributes, "opacity")) * svgOpacity(staticSvgMapPresentationAttribute(attributes, "fill-opacity"));
	if (!(opacity > 0)) return null;
	const fill = resolveStaticSvgPaintValue(staticSvgMapPresentationAttribute(attributes, "fill") ?? state.fill ?? "#000000", state.color);
	if (fill.trim().toLowerCase() === "none") return null;
	return {
		text,
		x,
		y,
		fill,
		opacity,
		fontFamily: state.fontFamily,
		fontSize: state.fontSize,
		fontWeight: state.fontWeight,
		fontStyle: state.fontStyle,
		textAnchor: state.textAnchor,
		dominantBaseline: state.dominantBaseline,
		transform: state.transform
	};
}
function staticSvgStrokeLayer(strokeValue, widthValue, opacityValue, lineJoinValue, lineCapValue, miterLimitValue, dashArrayValue, dashOffsetValue, currentState, shapeOpacity, currentColor) {
	const stroke = strokeValue ?? currentState.stroke;
	if (!stroke || stroke.trim().toLowerCase() === "none") return;
	const width = svgNonNegativeNumber(widthValue) ?? currentState.strokeWidth;
	if (!(width > 0)) return;
	const opacity = shapeOpacity * (opacityValue === null ? currentState.strokeOpacity : svgOpacity(opacityValue));
	if (!(opacity > 0)) return;
	const dashArray = svgStrokeDashArray(dashArrayValue);
	const dashOffset = svgStrokeDashOffset(dashOffsetValue);
	return {
		color: resolveStaticSvgPaintValue(stroke, currentColor),
		opacity,
		width,
		lineJoin: svgStrokeLineJoin(lineJoinValue) ?? currentState.strokeLineJoin,
		lineCap: svgStrokeLineCap(lineCapValue) ?? currentState.strokeLineCap,
		miterLimit: svgPositiveNumber(miterLimitValue) ?? currentState.strokeMiterLimit,
		dashArray: dashArray === void 0 ? currentState.strokeDashArray ?? void 0 : dashArray ?? void 0,
		dashOffset: dashOffset === void 0 ? currentState.strokeDashOffset : dashOffset
	};
}
function staticSvgComposeTransforms(parent, child) {
	if (!parent) return child;
	if (!child) return parent;
	return {
		a: parent.a * child.a + parent.c * child.b,
		b: parent.b * child.a + parent.d * child.b,
		c: parent.a * child.c + parent.c * child.d,
		d: parent.b * child.c + parent.d * child.d,
		e: parent.a * child.e + parent.c * child.f + parent.e,
		f: parent.b * child.e + parent.d * child.f + parent.f
	};
}
function staticSvgRectPathData(x, y, width, height, rxValue, ryValue) {
	if (width === null || height === null || width <= 0 || height <= 0) return null;
	const rx = Math.min(Math.max(rxValue ?? ryValue ?? 0, 0), width / 2);
	const ry = Math.min(Math.max(ryValue ?? rxValue ?? 0, 0), height / 2);
	if (rx > 0 && ry > 0) return `M${x + rx} ${y}H${x + width - rx}A${rx} ${ry} 0 0 1 ${x + width} ${y + ry}V${y + height - ry}A${rx} ${ry} 0 0 1 ${x + width - rx} ${y + height}H${x + rx}A${rx} ${ry} 0 0 1 ${x} ${y + height - ry}V${y + ry}A${rx} ${ry} 0 0 1 ${x + rx} ${y}Z`;
	return `M${x} ${y}H${x + width}V${y + height}H${x}Z`;
}
function staticSvgSupportedAttributes(elementName) {
	const paintAttributes = [
		"fill",
		"color",
		"fill-rule",
		"opacity",
		"fill-opacity",
		"stroke",
		"stroke-opacity",
		"stroke-width",
		"stroke-linejoin",
		"stroke-linecap",
		"stroke-miterlimit",
		"stroke-dasharray",
		"stroke-dashoffset",
		"style",
		"transform"
	];
	if (elementName === "path") return /* @__PURE__ */ new Set([
		"id",
		"class",
		"d",
		...paintAttributes
	]);
	if (elementName === "rect") return /* @__PURE__ */ new Set([
		"id",
		"class",
		"x",
		"y",
		"width",
		"height",
		"rx",
		"ry",
		...paintAttributes
	]);
	if (elementName === "circle") return /* @__PURE__ */ new Set([
		"id",
		"class",
		"cx",
		"cy",
		"r",
		...paintAttributes
	]);
	if (elementName === "ellipse") return /* @__PURE__ */ new Set([
		"id",
		"class",
		"cx",
		"cy",
		"rx",
		"ry",
		...paintAttributes
	]);
	if (elementName === "polygon" || elementName === "polyline") return /* @__PURE__ */ new Set([
		"id",
		"class",
		"points",
		...paintAttributes
	]);
	if (elementName === "line") return /* @__PURE__ */ new Set([
		"id",
		"class",
		"x1",
		"y1",
		"x2",
		"y2",
		...paintAttributes
	]);
	if (elementName === "text") return /* @__PURE__ */ new Set([
		"id",
		"class",
		"x",
		"y",
		"font-family",
		"font-size",
		"font-weight",
		"font-style",
		"text-anchor",
		"dominant-baseline",
		...paintAttributes
	]);
	if (elementName === "svg") return /* @__PURE__ */ new Set([
		"id",
		"class",
		"xmlns",
		"xmlns:xlink",
		"xml:space",
		"viewbox",
		"width",
		"height",
		"x",
		"y",
		"version",
		...paintAttributes
	]);
	if (elementName === "g") return /* @__PURE__ */ new Set([
		"id",
		"class",
		"xml:space",
		...paintAttributes
	]);
	if (elementName === "title" || elementName === "desc" || elementName === "metadata") return /* @__PURE__ */ new Set([
		"id",
		"class",
		"xml:space"
	]);
	if (elementName === "defs") return /* @__PURE__ */ new Set([
		"id",
		"class",
		"xml:space"
	]);
	return null;
}
function isStaticSvgAttributeSupported(elementName, supportedAttributes, name, value) {
	if (!supportedAttributes.has(name)) return isStaticSvgNonVisualAttributeSupported(name, value);
	if (name === "xmlns") return value.trim() === "http://www.w3.org/2000/svg";
	if (name === "xmlns:xlink") return value.trim() === "http://www.w3.org/1999/xlink";
	if (name === "xml:space") {
		const trimmedValue = value.trim();
		return trimmedValue === "default" || trimmedValue === "preserve";
	}
	if (name === "id" || name === "class") return !/[<>`]/.test(value);
	if (name === "viewbox") return isStaticSvgViewBoxValueSupported(value);
	if (name === "version") {
		const version = Number(value.trim());
		return Number.isFinite(version);
	}
	if (name === "d") return value.trim().length > 0;
	if (name === "fill" || name === "stroke") return isStaticSvgPaintValueSupported(value);
	if (name === "color") return isStaticSvgColorValueSupported(value);
	if (name === "stroke-opacity") return isStaticSvgOpacityValueSupported(value);
	if (name === "stroke-width") return isStaticSvgNonNegativeNumericValueSupported(value);
	if (name === "stroke-miterlimit") return isStaticSvgPositiveNumericValueSupported(value);
	if (name === "stroke-dasharray") return svgStrokeDashArray(value) !== void 0;
	if (name === "stroke-dashoffset") return svgStrokeDashOffset(value) !== void 0;
	if (name === "stroke-linejoin") return svgStrokeLineJoin(value) !== null;
	if (name === "stroke-linecap") return svgStrokeLineCap(value) !== null;
	if (name === "font-family") return svgFontFamily(value) !== null;
	if (name === "font-size") return isStaticSvgPositiveNumericValueSupported(value);
	if (name === "font-weight") return svgFontWeight(value) !== null;
	if (name === "font-style") return svgFontStyle(value) !== null;
	if (name === "text-anchor") return svgTextAnchor(value) !== null;
	if (name === "dominant-baseline") return svgDominantBaseline(value) !== null;
	if (name === "opacity") return elementName === "svg" || elementName === "g" ? isStaticSvgIdentityOpacityValueSupported(value) : isStaticSvgOpacityValueSupported(value);
	if (name === "fill-opacity") return isStaticSvgOpacityValueSupported(value);
	if (name === "fill-rule") return isStaticSvgFillRuleValueSupported(value);
	if (name === "style") return isStaticSvgStyleSupported(value, elementName !== "svg" && elementName !== "g", elementName === "svg" || elementName === "g");
	if (name === "transform") return parseStaticSvgTransform(value) !== void 0;
	if (name === "x" || name === "y" || name === "width" || name === "height" || name === "x1" || name === "y1" || name === "x2" || name === "y2") return isStaticSvgNumericValueSupported(value);
	if (elementName === "rect" && (name === "rx" || name === "ry")) return isStaticSvgNonNegativeNumericValueSupported(value);
	if (name === "cx" || name === "cy" || name === "r" || name === "rx" || name === "ry") return isStaticSvgNumericValueSupported(value);
	if (name === "points") return svgPointList(value).length >= 3;
	return elementName === "g";
}
function isStaticSvgNonVisualAttributeSupported(name, value) {
	const normalizedName = name.trim().toLowerCase();
	if (/[<>`]/.test(value)) return false;
	if (/^aria-[a-z0-9_-]+$/.test(normalizedName)) return true;
	if (/^data-[a-z0-9_.:-]+$/.test(normalizedName)) return true;
	if (normalizedName === "role") {
		const trimmedValue = value.trim();
		return /^[a-z][a-z0-9_-]*(?:\s+[a-z][a-z0-9_-]*)*$/i.test(trimmedValue);
	}
	if (normalizedName === "focusable") return [
		"true",
		"false",
		"auto"
	].includes(value.trim().toLowerCase());
	return false;
}
function isStaticSvgNumericValueSupported(value) {
	return svgNumber(value) !== null;
}
function isStaticSvgNonNegativeNumericValueSupported(value) {
	const number = svgNumber(value);
	return number !== null && number >= 0;
}
function isStaticSvgPositiveNumericValueSupported(value) {
	const number = svgNumber(value);
	return number !== null && number > 0;
}
function isStaticSvgViewBoxValueSupported(value) {
	const numbers = value.trim().split(/[\s,]+/).filter((part) => part.length > 0).map((part) => Number(part));
	return numbers.length === 4 && numbers.every((number) => Number.isFinite(number)) && numbers[2] > 0 && numbers[3] > 0;
}
function svgPointList(value) {
	const numbers = value.trim().split(/[\s,]+/).filter((part) => part.length > 0).map((part) => Number(part));
	if (numbers.length < 6 || numbers.length % 2 !== 0 || numbers.some((number) => !Number.isFinite(number))) return [];
	const points = [];
	for (let index = 0; index < numbers.length; index += 2) points.push([numbers[index], numbers[index + 1]]);
	return points;
}
function parseStaticSvgTransform(value) {
	if (value === null || value === void 0) return;
	const source = value.trim();
	if (source.length === 0) return;
	let transform = {
		a: 1,
		b: 0,
		c: 0,
		d: 1,
		e: 0,
		f: 0
	};
	let cursor = 0;
	for (const match of source.matchAll(/([A-Za-z][A-Za-z0-9]*)\s*\(([^)]*)\)/g)) {
		const prefix = source.slice(cursor, match.index);
		if (!/^[\s,]*$/.test(prefix)) return;
		cursor = (match.index ?? 0) + match[0].length;
		const rawArguments = match[2].trim();
		const numbers = rawArguments.length === 0 ? [] : rawArguments.split(/[\s,]+/).filter((part) => part.length > 0).map((part) => Number(part));
		if (numbers.some((number) => !Number.isFinite(number))) return;
		const operation = match[1].toLowerCase();
		let next;
		if (operation === "matrix" && numbers.length === 6) next = {
			a: numbers[0],
			b: numbers[1],
			c: numbers[2],
			d: numbers[3],
			e: numbers[4],
			f: numbers[5]
		};
		else if (operation === "translate" && (numbers.length === 1 || numbers.length === 2)) next = {
			a: 1,
			b: 0,
			c: 0,
			d: 1,
			e: numbers[0],
			f: numbers[1] ?? 0
		};
		else if (operation === "scale" && (numbers.length === 1 || numbers.length === 2)) next = {
			a: numbers[0],
			b: 0,
			c: 0,
			d: numbers[1] ?? numbers[0],
			e: 0,
			f: 0
		};
		else if (operation === "rotate" && (numbers.length === 1 || numbers.length === 3)) {
			const radians = numbers[0] * Math.PI / 180;
			const cos = Math.cos(radians);
			const sin = Math.sin(radians);
			if (numbers.length === 3) {
				const cx = numbers[1];
				const cy = numbers[2];
				next = {
					a: cos,
					b: sin,
					c: -sin,
					d: cos,
					e: cx - cos * cx + sin * cy,
					f: cy - sin * cx - cos * cy
				};
			} else next = {
				a: cos,
				b: sin,
				c: -sin,
				d: cos,
				e: 0,
				f: 0
			};
		} else if (operation === "skewx" && numbers.length === 1) next = {
			a: 1,
			b: 0,
			c: Math.tan(numbers[0] * Math.PI / 180),
			d: 1,
			e: 0,
			f: 0
		};
		else if (operation === "skewy" && numbers.length === 1) next = {
			a: 1,
			b: Math.tan(numbers[0] * Math.PI / 180),
			c: 0,
			d: 1,
			e: 0,
			f: 0
		};
		else return;
		if (!Object.values(next).every((number) => Number.isFinite(number))) return;
		transform = staticSvgComposeTransforms(transform, next) ?? transform;
	}
	if (!/^[\s,]*$/.test(source.slice(cursor)) || cursor === 0) return;
	return transform;
}
function isStaticSvgStyleSupported(style, allowOpacity, allowIdentityOpacity = false) {
	const normalizedStyle = staticSvgStyleWithoutComments(style);
	if (normalizedStyle === null) return false;
	const supportedProperties = /* @__PURE__ */ new Set([
		"fill",
		"color",
		"fill-rule",
		"fill-opacity",
		"stroke",
		"stroke-opacity",
		"stroke-width",
		"stroke-linejoin",
		"stroke-linecap",
		"stroke-miterlimit",
		"stroke-dasharray",
		"stroke-dashoffset",
		"font-family",
		"font-size",
		"font-weight",
		"font-style",
		"text-anchor",
		"dominant-baseline"
	]);
	if (allowOpacity || allowIdentityOpacity) supportedProperties.add("opacity");
	for (const declaration of normalizedStyle.split(";")) {
		const separator = declaration.indexOf(":");
		if (separator < 0) {
			if (declaration.trim().length > 0) return false;
			continue;
		}
		const property = declaration.slice(0, separator).trim().toLowerCase();
		const value = declaration.slice(separator + 1).trim();
		if (!supportedProperties.has(property)) return false;
		if ((property === "fill" || property === "stroke") && !isStaticSvgPaintValueSupported(value)) return false;
		if (property === "color" && !isStaticSvgColorValueSupported(value)) return false;
		if (property === "opacity" && allowIdentityOpacity && !allowOpacity) {
			if (!isStaticSvgIdentityOpacityValueSupported(value)) return false;
			continue;
		}
		if ((property === "opacity" || property === "fill-opacity" || property === "stroke-opacity") && !isStaticSvgOpacityValueSupported(value)) return false;
		if (property === "stroke-width" && !isStaticSvgNonNegativeNumericValueSupported(value)) return false;
		if (property === "stroke-miterlimit" && !isStaticSvgPositiveNumericValueSupported(value)) return false;
		if (property === "stroke-dasharray" && svgStrokeDashArray(value) === void 0) return false;
		if (property === "stroke-dashoffset" && svgStrokeDashOffset(value) === void 0) return false;
		if (property === "stroke-linejoin" && svgStrokeLineJoin(value) === null) return false;
		if (property === "stroke-linecap" && svgStrokeLineCap(value) === null) return false;
		if (property === "fill-rule" && !isStaticSvgFillRuleValueSupported(value)) return false;
		if (property === "font-family" && svgFontFamily(value) === null) return false;
		if (property === "font-size" && !isStaticSvgPositiveNumericValueSupported(value)) return false;
		if (property === "font-weight" && svgFontWeight(value) === null) return false;
		if (property === "font-style" && svgFontStyle(value) === null) return false;
		if (property === "text-anchor" && svgTextAnchor(value) === null) return false;
		if (property === "dominant-baseline" && svgDominantBaseline(value) === null) return false;
	}
	return true;
}
function isStaticSvgPaintValueSupported(value) {
	const trimmed = value.trim();
	const normalized = trimmed.toLowerCase();
	if (normalized.length === 0 || STATIC_SVG_UNSUPPORTED_INDIRECT_PAINT_VALUES.has(normalized) || /\burl\s*\(/.test(normalized) || /\bvar\s*\(/.test(normalized)) return false;
	if (normalized === "none" || normalized === "currentcolor") return true;
	return parseSupportedCssColor(trimmed) !== null;
}
function isStaticSvgColorValueSupported(value) {
	const trimmed = value.trim();
	const normalized = trimmed.toLowerCase();
	return normalized !== "none" && normalized !== "currentcolor" && isStaticSvgPaintValueSupported(trimmed);
}
function resolveStaticSvgPaintValue(value, currentColor) {
	return value.trim().toLowerCase() === "currentcolor" ? currentColor : value;
}
function isStaticSvgOpacityValueSupported(value) {
	const trimmed = value.trim();
	if (trimmed.length === 0) return false;
	const numeric = trimmed.endsWith("%") ? trimmed.slice(0, -1).trim() : trimmed;
	return numeric.length > 0 && Number.isFinite(Number(numeric));
}
function isStaticSvgIdentityOpacityValueSupported(value) {
	const trimmed = value.trim();
	if (!isStaticSvgOpacityValueSupported(trimmed)) return false;
	return (trimmed.endsWith("%") ? Number(trimmed.slice(0, -1).trim()) / 100 : Number(trimmed)) === 1;
}
function isStaticSvgFillRuleValueSupported(value) {
	const normalized = value.trim().toLowerCase();
	return normalized === "nonzero" || normalized === "evenodd";
}
function svgOpacity(value) {
	if (!value) return 1;
	const trimmed = value.trim();
	const parsed = Number.parseFloat(trimmed);
	if (!Number.isFinite(parsed)) return 1;
	const unitValue = trimmed.endsWith("%") ? parsed / 100 : parsed;
	return Math.max(0, Math.min(1, unitValue));
}
function svgNumber(value) {
	const trimmed = value.trim();
	if (trimmed.length === 0) return null;
	const numeric = trimmed.toLowerCase().endsWith("px") ? trimmed.slice(0, -2).trim() : trimmed;
	if (numeric.length === 0) return null;
	const number = Number(numeric);
	return Number.isFinite(number) ? number : null;
}
function svgPositiveNumber(value) {
	if (value === null) return null;
	const number = svgNumber(value);
	return number !== null && number > 0 ? number : null;
}
function svgNonNegativeNumber(value) {
	if (value === null) return null;
	const number = svgNumber(value);
	return number !== null && number >= 0 ? number : null;
}
function svgStrokeLineJoin(value) {
	const normalized = value?.trim().toLowerCase();
	if (normalized === "miter" || normalized === "round" || normalized === "bevel") return normalized;
	return null;
}
function svgStrokeLineCap(value) {
	const normalized = value?.trim().toLowerCase();
	if (normalized === "butt" || normalized === "round" || normalized === "square") return normalized;
	return null;
}
function svgFontFamily(value) {
	const trimmed = value?.trim();
	if (!trimmed || /[<>`]/.test(trimmed)) return null;
	return trimmed.split(",")[0].trim().replace(/^['"]|['"]$/g, "") || null;
}
function svgFontWeight(value) {
	if (value === null) return null;
	const normalized = value?.trim().toLowerCase();
	if (normalized === "" || normalized === "normal" || normalized === "400") return "normal";
	if (normalized === "bold" || normalized === "700" || normalized === "600") return "bold";
	return null;
}
function svgFontStyle(value) {
	if (value === null) return null;
	const normalized = value?.trim().toLowerCase();
	if (normalized === "" || normalized === "normal") return "normal";
	if (normalized === "italic" || normalized === "oblique") return "italic";
	return null;
}
function svgTextAnchor(value) {
	if (value === null) return null;
	const normalized = value?.trim().toLowerCase();
	if (normalized === "" || normalized === "start" || normalized === "middle" || normalized === "end") return normalized || "start";
	return null;
}
function svgDominantBaseline(value) {
	if (value === null) return null;
	const normalized = value?.trim().toLowerCase();
	if (normalized === "" || normalized === "auto" || normalized === "alphabetic" || normalized === "baseline") return "alphabetic";
	if (normalized === "middle" || normalized === "central") return "middle";
	return null;
}
function svgStrokeDashArray(value) {
	if (value === null) return;
	const trimmed = value.trim();
	if (trimmed.toLowerCase() === "none") return null;
	const values = trimmed.split(/[\s,]+/).filter((part) => part.length > 0);
	if (values.length === 0) return;
	const parsed = values.map((part) => svgNumber(part));
	if (parsed.some((part) => part === null || part < 0) || !parsed.some((part) => part !== null && part > 0)) return;
	const dashValues = parsed;
	return dashValues.length % 2 === 0 ? dashValues : [...dashValues, ...dashValues];
}
function svgStrokeDashOffset(value) {
	if (value === null) return;
	return svgNumber(value) ?? void 0;
}
function svgFillRule(value) {
	return value?.trim().toLowerCase() === "evenodd" ? "evenodd" : void 0;
}
//#endregion
//#region src/view/canvaskit/bounded-response.ts
async function readBoundedResponseArrayBuffer(response, options) {
	const { maxBytes, signal, isCancelled } = options;
	if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) throw new Error(`response byte limit is invalid: ${maxBytes}`);
	const cancelledMessage = options.cancelledMessage ?? "response read was cancelled";
	const throwIfCancelled = () => {
		if (signal?.aborted || isCancelled?.()) throw new Error(cancelledMessage);
	};
	throwIfCancelled();
	const rawContentLength = response.headers?.get?.("content-length")?.trim() ?? null;
	const declaredLength = rawContentLength !== null && /^\d+$/.test(rawContentLength) ? Number(rawContentLength) : null;
	if (declaredLength !== null && Number.isSafeInteger(declaredLength) && declaredLength > maxBytes) {
		const error = /* @__PURE__ */ new Error(`response payload exceeds ${maxBytes} bytes`);
		try {
			await response.body?.cancel(error);
		} catch {}
		throw error;
	}
	const body = response.body;
	if (!body || typeof body.getReader !== "function") throw new Error("bounded response body stream is unavailable");
	const reader = body.getReader();
	const chunks = [];
	let totalBytes = 0;
	const cancelReader = () => {
		try {
			reader.cancel(cancelledMessage).catch(() => {});
		} catch {}
	};
	signal?.addEventListener("abort", cancelReader, { once: true });
	if (signal?.aborted) cancelReader();
	try {
		while (true) {
			throwIfCancelled();
			const { done, value } = await reader.read();
			throwIfCancelled();
			if (done) break;
			if (!(value instanceof Uint8Array)) {
				const error = /* @__PURE__ */ new Error("response body produced a non-byte chunk");
				try {
					await reader.cancel(error);
				} catch {}
				throw error;
			}
			if (value.byteLength > maxBytes - totalBytes) {
				const error = /* @__PURE__ */ new Error(`response payload exceeds ${maxBytes} bytes`);
				try {
					await reader.cancel(error);
				} catch {}
				throw error;
			}
			chunks.push(value);
			totalBytes += value.byteLength;
		}
	} catch (error) {
		throwIfCancelled();
		throw error;
	} finally {
		signal?.removeEventListener("abort", cancelReader);
		reader.releaseLock();
	}
	if (totalBytes === 0) throw new Error("response payload is empty");
	const bytes = new Uint8Array(totalBytes);
	let offset = 0;
	for (const chunk of chunks) {
		bytes.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return bytes.buffer;
}
//#endregion
//#region src/view/canvaskit-renderer.ts
var OLD_HANGUL_FONT_FAMILY = "Source Han Serif K Old Hangul";
var VERTICAL_PRESENTATION_BASE_TEXT = /* @__PURE__ */ new Map([
	["︙", "…"],
	["︱", "—"],
	["︲", "–"],
	["︳", "_"],
	["︴", "~"],
	["︵", "("],
	["︶", ")"],
	["︷", "{"],
	["︸", "}"],
	["︹", "["],
	["︺", "]"],
	["︻", "【"],
	["︼", "】"],
	["︽", "《"],
	["︾", "》"],
	["︿", "〈"],
	["﹀", "〉"],
	["﹁", "「"],
	["﹂", "」"],
	["﹃", "『"],
	["﹄", "』"]
]);
var COMPLEX_SHAPING_UNICODE_CATEGORY = /[\p{M}\p{Cf}]/u;
function primaryFontFamily(value) {
	return (value ?? "").split(",")[0].trim().replace(/^(["'])|(["'])$/g, "");
}
function normalizedFontFamily(value) {
	return primaryFontFamily(value).replace(/\u0000/g, "").normalize("NFC").replace(/\s+/g, " ").trim().toLocaleLowerCase("en-US");
}
function textRequiresComplexShaping(text) {
	for (const character of text) {
		const codePoint = character.codePointAt(0) ?? 0;
		if (codePoint >= 4352 && codePoint <= 4607 || codePoint >= 43360 && codePoint <= 43391 || codePoint >= 55216 && codePoint <= 55295 || codePoint >= 983729 && codePoint <= 983748) continue;
		if (!(codePoint <= 767 || codePoint >= 880 && codePoint <= 1423 || codePoint >= 7680 && codePoint <= 8191 || codePoint >= 8192 && codePoint <= 12287 || codePoint >= 11904 && codePoint <= 55215 || codePoint >= 57344 && codePoint <= 63743 || codePoint >= 63744 && codePoint <= 64262 || codePoint >= 65040 && codePoint <= 65055 || codePoint >= 65072 && codePoint <= 65135 || codePoint >= 65280 && codePoint <= 65519 || codePoint >= 119808 && codePoint <= 120831 || codePoint >= 131072 && codePoint <= 205743) || COMPLEX_SHAPING_UNICODE_CATEGORY.test(character)) return true;
	}
	return false;
}
function textRunHasPaintEffects(style) {
	const shadeColor = (style.shadeColor ?? "#ffffff").toLowerCase();
	return (style.outlineType ?? 0) !== 0 || (style.shadowType ?? 0) !== 0 || style.emboss === true || style.engrave === true || shadeColor !== "#ffffff" && shadeColor !== "#000000" || Math.abs((style.ratio ?? 1) - 1) > Number.EPSILON;
}
var CanvasKitLayerRenderer = class CanvasKitLayerRenderer {
	canvasKit;
	renderMode;
	surfaceRequest;
	defaultTypeface;
	symbolFallbackTypeface;
	defaultFontManager;
	defaultFontFamily;
	defaultFontUrl;
	requirePreparedFontFamilies;
	oldHangulTypeface;
	oldHangulFontUrl;
	static MAX_IMAGE_TILE_DRAWS = 4096;
	static MAX_IMAGE_CACHE_ENTRIES = 128;
	static MAX_IMAGE_FAILURE_CACHE_ENTRIES = 128;
	static MAX_SVG_GLYPH_CACHE_ENTRIES = 128;
	static MAX_IMAGE_CACHE_PIXELS = 67108864;
	static MAX_BITMAP_GLYPH_BASE64_LENGTH = Math.ceil(4194304 / 3) * 4;
	static MAX_STATIC_SVG_GLYPH_BYTES = 1048576;
	static MAX_PLACEHOLDER_DASH_SEGMENTS_PER_AXIS = 2048;
	static MAX_EQUATION_LAYOUT_DEPTH = 64;
	static MAX_EQUATION_LAYOUT_NODES = 4096;
	static MAX_EQUATION_TEXT_LENGTH = 4096;
	static MAX_TEXT_VISUAL_WAVE_SEGMENTS = 4096;
	static MAX_TEXT_SPECIAL_VISUAL_ITEMS = 4096;
	static MAX_TEXT_RUN_CODE_POINTS = 4096;
	static MAX_TEXT_RUN_FALLBACK_SPANS = 4096;
	static MAX_FONT_SUBSTITUTION_DIAGNOSTICS = 4096;
	static MAX_SHAPED_TEXT_WIDTH = 1e6;
	static MAX_BUNDLED_FONT_BYTES = 33554432;
	imageCache = /* @__PURE__ */ new Map();
	imageDecodeFailures = /* @__PURE__ */ new Map();
	currentImageFailures = /* @__PURE__ */ new Map();
	svgGlyphPathCache = /* @__PURE__ */ new Map();
	svgGlyphParseFailures = /* @__PURE__ */ new Set();
	localTypefaces = /* @__PURE__ */ new Map();
	localTypefaceLoadFailures = /* @__PURE__ */ new Set();
	localTypefacePending = /* @__PURE__ */ new Map();
	bundledTypefaces = /* @__PURE__ */ new Map();
	bundledTypefaceAliases = /* @__PURE__ */ new Map();
	bundledTypefaceLoadFailures = /* @__PURE__ */ new Set();
	currentFontSubstitutions = /* @__PURE__ */ new Map();
	bundledFontRequests = /* @__PURE__ */ new Set();
	glyphRunFonts;
	unsupportedOps = /* @__PURE__ */ new Set();
	surfaceBackend = null;
	surfaceFallbackReason = null;
	lastRenderError = null;
	lastRenderCompleted = false;
	lastRenderDurationMs = null;
	renderCount = 0;
	imageCacheHits = 0;
	imageCacheMisses = 0;
	imageCacheEvictions = 0;
	imageFailureCacheHits = 0;
	imageCachePixels = 0;
	currentResources;
	currentFontResources;
	currentShowParagraphMarks = false;
	currentShowControlCodes = false;
	currentReplayFeatureCounts = {
		dashedStrokes: 0,
		glyphRuns: 0,
		verticalPresentationPunctuation: 0,
		verticalTextRuns: 0
	};
	selectedTextVariantOps = /* @__PURE__ */ new WeakSet();
	documentGeneration = 0;
	disposed = false;
	constructor(canvasKit, renderMode, surfaceRequest, defaultTypeface, symbolFallbackTypeface, defaultFontManager = null, defaultFontFamily = null, defaultFontUrl = "fonts/NotoSansKR-Regular.woff2", requirePreparedFontFamilies = false, oldHangulTypeface = null, oldHangulFontUrl = "fonts/SourceHanSerifK-OldHangul-subset.woff2") {
		this.canvasKit = canvasKit;
		this.renderMode = renderMode;
		this.surfaceRequest = surfaceRequest;
		this.defaultTypeface = defaultTypeface;
		this.symbolFallbackTypeface = symbolFallbackTypeface;
		this.defaultFontManager = defaultFontManager;
		this.defaultFontFamily = defaultFontFamily;
		this.defaultFontUrl = defaultFontUrl;
		this.requirePreparedFontFamilies = requirePreparedFontFamilies;
		this.oldHangulTypeface = oldHangulTypeface;
		this.oldHangulFontUrl = oldHangulFontUrl;
		this.glyphRunFonts = new CanvasKitGlyphRunFontCache(canvasKit);
	}
	static async create(renderMode = "default", surfaceRequest = DEFAULT_CANVASKIT_SURFACE_REQUEST, options = {}) {
		const canvasKit = await (0, import_canvaskit.default)({ locateFile: (file) => file === "canvaskit.wasm" ? canvaskit_wasm_url_default : file });
		const resolvedSurfaceRequest = typeof surfaceRequest === "string" ? {
			...DEFAULT_CANVASKIT_SURFACE_REQUEST,
			preference: surfaceRequest,
			requested: surfaceRequest
		} : surfaceRequest;
		let defaultTypeface = null;
		let defaultFontManager = null;
		let defaultFontFamily = null;
		const defaultFontUrl = options.defaultFontUrl ?? "fonts/NotoSansKR-Regular.woff2";
		try {
			const response = await fetch(defaultFontUrl);
			if (response.ok) {
				const bytes = await readBoundedResponseArrayBuffer(response, { maxBytes: CanvasKitLayerRenderer.MAX_BUNDLED_FONT_BYTES });
				defaultTypeface = canvasKit.Typeface.MakeFreeTypeFaceFromData(bytes) ?? canvasKit.Typeface.MakeTypefaceFromData(bytes);
				defaultFontManager = canvasKit.FontMgr.FromData(bytes);
				if (defaultFontManager && defaultFontManager.countFamilies() > 0) defaultFontFamily = defaultFontManager.getFamilyName(0);
			}
		} catch (error) {
			console.warn("[CanvasKitLayerRenderer] 기본 CJK 폰트 로딩 실패:", error);
		}
		let symbolFallbackTypeface = null;
		const symbolFallbackFontUrl = options.symbolFallbackFontUrl ?? "fonts/D2Coding-Regular.woff2";
		try {
			const response = await fetch(symbolFallbackFontUrl);
			if (response.ok) {
				const bytes = await readBoundedResponseArrayBuffer(response, { maxBytes: CanvasKitLayerRenderer.MAX_BUNDLED_FONT_BYTES });
				symbolFallbackTypeface = canvasKit.Typeface.MakeFreeTypeFaceFromData(bytes) ?? canvasKit.Typeface.MakeTypefaceFromData(bytes);
			}
		} catch (error) {
			console.warn("[CanvasKitLayerRenderer] 기호 폴백 폰트 로딩 실패:", error);
		}
		let oldHangulTypeface = null;
		const oldHangulFontUrl = options.oldHangulFontUrl ?? "fonts/SourceHanSerifK-OldHangul-subset.woff2";
		let oldHangulNativeTypeface = null;
		let oldHangulFontManager = null;
		try {
			const response = await fetch(oldHangulFontUrl);
			if (response.ok) {
				const bytes = await readBoundedResponseArrayBuffer(response, { maxBytes: CanvasKitLayerRenderer.MAX_BUNDLED_FONT_BYTES });
				oldHangulNativeTypeface = canvasKit.Typeface.MakeFreeTypeFaceFromData(bytes) ?? canvasKit.Typeface.MakeTypefaceFromData(bytes);
				oldHangulFontManager = canvasKit.FontMgr.FromData(bytes.slice(0));
				const fontFamily = oldHangulFontManager && oldHangulFontManager.countFamilies() > 0 ? oldHangulFontManager.getFamilyName(0) : OLD_HANGUL_FONT_FAMILY;
				if (oldHangulNativeTypeface || oldHangulFontManager) {
					oldHangulTypeface = {
						typeface: oldHangulNativeTypeface,
						fontManager: oldHangulFontManager,
						fontFamily
					};
					oldHangulNativeTypeface = null;
					oldHangulFontManager = null;
				}
			}
		} catch (error) {
			oldHangulNativeTypeface?.delete?.();
			oldHangulFontManager?.delete?.();
			console.warn("[CanvasKitLayerRenderer] 옛한글 shaping 폰트 로딩 실패:", error);
		}
		return new CanvasKitLayerRenderer(canvasKit, renderMode, resolvedSurfaceRequest, defaultTypeface, symbolFallbackTypeface, defaultFontManager, defaultFontFamily, defaultFontUrl, options.requirePreparedFontFamilies ?? false, oldHangulTypeface, oldHangulFontUrl);
	}
	/** Auto selection에서 승인된 문서 폰트를 첫 replay 전에 native Typeface로 등록한다. */
	async prepareBundledFonts(sources) {
		if (this.disposed || sources.length === 0) return 0;
		const generation = this.documentGeneration;
		let registered = 0;
		for (const source of sources) {
			if (!source.url || source.aliases.length === 0) continue;
			const requiresShapingManager = source.aliases.some((alias) => normalizedFontFamily(alias) === normalizedFontFamily(OLD_HANGUL_FONT_FAMILY));
			let prepared = source.url === this.oldHangulFontUrl && this.oldHangulTypeface ? this.oldHangulTypeface : source.url === this.defaultFontUrl && (this.defaultTypeface || this.defaultFontManager) ? {
				typeface: this.defaultTypeface,
				fontManager: this.defaultFontManager,
				fontFamily: this.defaultFontFamily
			} : this.bundledTypefaces.get(source.url) ?? null;
			if (prepared && requiresShapingManager && !prepared.fontManager) throw new Error(`CanvasKit shaping font source 준비 실패: ${source.url}`);
			if (!prepared) {
				if (this.bundledTypefaceLoadFailures.has(source.url)) throw new Error(`CanvasKit font source 준비 실패: ${source.url}`);
				let typeface = null;
				let fontManager = null;
				const request = new AbortController();
				this.bundledFontRequests.add(request);
				try {
					if (this.disposed || generation !== this.documentGeneration) throw new Error("문서 교체로 CanvasKit font 준비가 취소되었습니다");
					const response = await fetch(source.url, { signal: request.signal });
					if (!response.ok) throw new Error(`HTTP ${response.status}`);
					const bytes = await readBoundedResponseArrayBuffer(response, {
						maxBytes: CanvasKitLayerRenderer.MAX_BUNDLED_FONT_BYTES,
						signal: request.signal,
						isCancelled: () => this.disposed || generation !== this.documentGeneration,
						cancelledMessage: "문서 교체로 CanvasKit font 준비가 취소되었습니다"
					});
					if (this.disposed || generation !== this.documentGeneration) throw new Error("문서 교체로 CanvasKit font 준비가 취소되었습니다");
					typeface = this.canvasKit.Typeface.MakeFreeTypeFaceFromData(bytes) ?? this.canvasKit.Typeface.MakeTypefaceFromData(bytes);
					fontManager = this.canvasKit.FontMgr.FromData(bytes.slice(0));
					if (!typeface && !fontManager || requiresShapingManager && !fontManager) throw new Error("CanvasKit이 font payload를 해석하지 못했습니다");
					const fontFamily = fontManager && fontManager.countFamilies() > 0 ? fontManager.getFamilyName(0) : source.aliases[0];
					prepared = {
						typeface,
						fontManager,
						fontFamily
					};
					this.bundledTypefaces.set(source.url, prepared);
					registered += 1;
					typeface = null;
					fontManager = null;
				} catch (error) {
					typeface?.delete?.();
					fontManager?.delete?.();
					if (!request.signal.aborted && !this.disposed && generation === this.documentGeneration) this.bundledTypefaceLoadFailures.add(source.url);
					throw new Error(`CanvasKit font source 준비 실패 (${source.url}): ${error}`);
				} finally {
					this.bundledFontRequests.delete(request);
				}
			}
			for (const alias of source.aliases) {
				const key = normalizedFontFamily(alias);
				if (key) this.bundledTypefaceAliases.set(key, prepared);
			}
			await Promise.resolve();
		}
		return registered;
	}
	/** 현재 문서가 실제로 사용하는 설치 글꼴만 CanvasKit native 객체로 등록한다. */
	async prepareLocalFonts(fontNames) {
		if (this.disposed || !fontNames?.length) return 0;
		const generation = this.documentGeneration;
		const pendingRecords = /* @__PURE__ */ new Map();
		for (const fontName of fontNames) {
			const record = resolveLocalFont(fontName);
			const faceKey = record ? localFontFaceKey(record) : "";
			if (!record || !faceKey || this.localTypefaces.has(faceKey) || this.localTypefaceLoadFailures.has(faceKey) || this.localTypefacePending.has(faceKey)) continue;
			pendingRecords.set(faceKey, record);
			this.localTypefacePending.set(faceKey, generation);
		}
		let registered = 0;
		try {
			const bytesByFace = await loadLocalFontBytesFor([...pendingRecords.values()].map((record) => record.fullName));
			for (const [faceKey, record] of pendingRecords) {
				const bytes = bytesByFace.get(faceKey);
				if (this.disposed || generation !== this.documentGeneration) return registered;
				if (this.localTypefaces.has(faceKey) || this.localTypefaceLoadFailures.has(faceKey)) continue;
				if (!bytes) {
					this.localTypefaceLoadFailures.add(faceKey);
					continue;
				}
				let typeface = null;
				let fontManager = null;
				try {
					typeface = this.canvasKit.Typeface.MakeFreeTypeFaceFromData(bytes) ?? this.canvasKit.Typeface.MakeTypefaceFromData(bytes);
					fontManager = this.canvasKit.FontMgr.FromData(bytes.slice(0));
					if (!typeface && !fontManager) {
						this.localTypefaceLoadFailures.add(faceKey);
						continue;
					}
					const fontFamily = fontManager && fontManager.countFamilies() > 0 ? fontManager.getFamilyName(0) : record.family;
					this.localTypefaces.set(faceKey, {
						typeface,
						fontManager,
						fontFamily
					});
					registered += 1;
				} catch (error) {
					typeface?.delete?.();
					fontManager?.delete?.();
					this.localTypefaceLoadFailures.add(faceKey);
					console.warn(`[CanvasKitLayerRenderer] ${record.displayName} local Typeface 등록 실패:`, error);
				}
				await new Promise((resolve) => window.setTimeout(resolve, 0));
			}
		} finally {
			for (const faceKey of pendingRecords.keys()) if (this.localTypefacePending.get(faceKey) === generation) this.localTypefacePending.delete(faceKey);
		}
		return registered;
	}
	renderPage(tree, targetCanvas, scale, pageInfo) {
		if (this.disposed) throw new Error("CanvasKit renderer가 이미 dispose되었습니다");
		this.unsupportedOps.clear();
		this.currentImageFailures.clear();
		this.currentFontSubstitutions.clear();
		this.resetReplayFeatureCounts();
		this.lastRenderError = null;
		this.lastRenderCompleted = false;
		let surface = null;
		let renderedCanvas = targetCanvas;
		const renderStartedAt = performance.now();
		try {
			const surfaceTarget = this.makeSurface(targetCanvas);
			surface = surfaceTarget.surface;
			renderedCanvas = surfaceTarget.canvas;
			const canvas = surface.getCanvas();
			this.currentResources = tree.resources;
			this.currentFontResources = tree.fontResources;
			this.glyphRunFonts.registerResources(tree.fontResources, tree.resources);
			this.currentShowParagraphMarks = tree.outputOptions?.showParagraphMarks === true;
			this.currentShowControlCodes = tree.outputOptions?.showControlCodes === true;
			if (this.currentShowControlCodes) this.unsupportedOps.add("viewOption:showControlCodes");
			this.selectedTextVariantOps = /* @__PURE__ */ new WeakSet();
			this.selectTextVariants(tree.root);
			let hasPageBackground = false;
			const stack = [tree.root];
			while (stack.length > 0 && !hasPageBackground) {
				const node = stack.pop();
				if (node.kind === "group") stack.push(...node.children);
				else if (node.kind === "clipRect") stack.push(node.child);
				else hasPageBackground = node.ops.some((op) => op.type === "pageBackground");
			}
			canvas.save();
			canvas.clear(this.color(hasPageBackground ? "rgba(0,0,0,0)" : "#ffffff"));
			canvas.scale(scale, scale);
			const rightOverflowSlop = tree.outputOptions?.showParagraphMarks || tree.outputOptions?.showControlCodes ? 48 : void 0;
			for (const replayPlane of CANVASKIT_REPLAY_PLANES) this.renderNode(canvas, tree.root, tree.profile ?? "screen", replayPlane, null, rightOverflowSlop);
			if (pageInfo) {
				const paint = this.makeStrokePaint("#c0c0c0", .3);
				const left = pageInfo.marginLeft;
				const top = pageInfo.marginHeader + pageInfo.marginTop;
				const right = pageInfo.width - pageInfo.marginRight;
				const bottom = pageInfo.height - pageInfo.marginFooter - pageInfo.marginBottom;
				const length = 15;
				canvas.drawLine(left, top - length, left, top, paint);
				canvas.drawLine(left, top, left - length, top, paint);
				canvas.drawLine(right + length, top, right, top, paint);
				canvas.drawLine(right, top, right, top - length, paint);
				canvas.drawLine(left - length, bottom, left, bottom, paint);
				canvas.drawLine(left, bottom, left, bottom + length, paint);
				canvas.drawLine(right, bottom + length, right, bottom, paint);
				canvas.drawLine(right, bottom, right + length, bottom, paint);
				paint.delete();
			}
			canvas.restore();
			surface.flush();
			this.lastRenderCompleted = true;
		} catch (error) {
			this.recordRenderFailure(error);
			throw error;
		} finally {
			surface?.delete();
			this.currentResources = void 0;
			this.currentFontResources = void 0;
			this.currentShowParagraphMarks = false;
			this.currentShowControlCodes = false;
			this.lastRenderDurationMs = performance.now() - renderStartedAt;
			this.renderCount += 1;
		}
		return renderedCanvas;
	}
	releaseLayerTree(_tree) {}
	resetDocumentResources() {
		this.documentGeneration += 1;
		this.cancelDocumentPreparation();
		for (const entry of this.imageCache.values()) entry.image?.delete?.();
		this.imageCache.clear();
		this.imageCachePixels = 0;
		this.imageDecodeFailures.clear();
		this.svgGlyphPathCache.clear();
		this.svgGlyphParseFailures.clear();
		this.currentResources = void 0;
		this.currentFontResources = void 0;
		this.selectedTextVariantOps = /* @__PURE__ */ new WeakSet();
		this.glyphRunFonts.clear();
		for (const { typeface, fontManager } of this.localTypefaces.values()) {
			typeface?.delete?.();
			fontManager?.delete?.();
		}
		this.localTypefaces.clear();
		this.localTypefaceLoadFailures.clear();
		this.localTypefacePending.clear();
		for (const { typeface, fontManager } of this.bundledTypefaces.values()) {
			typeface?.delete?.();
			fontManager?.delete?.();
		}
		this.bundledTypefaces.clear();
		this.bundledTypefaceAliases.clear();
		this.bundledTypefaceLoadFailures.clear();
		this.imageCacheHits = 0;
		this.imageCacheMisses = 0;
		this.imageCacheEvictions = 0;
		this.imageFailureCacheHits = 0;
		this.currentImageFailures.clear();
		this.currentFontSubstitutions.clear();
		this.resetReplayFeatureCounts();
		this.renderCount = 0;
		this.lastRenderDurationMs = null;
	}
	cancelDocumentPreparation() {
		for (const request of this.bundledFontRequests) request.abort(/* @__PURE__ */ new Error("문서 교체로 CanvasKit font 준비가 취소되었습니다"));
		this.bundledFontRequests.clear();
	}
	diagnostics() {
		const lastUnsupportedOps = [...this.unsupportedOps].sort();
		const lastExpectedUnsupportedOps = lastUnsupportedOps.filter(isExpectedCanvasKitUnsupportedOp);
		const lastUnexpectedUnsupportedOps = lastUnsupportedOps.filter((op) => !isExpectedCanvasKitUnsupportedOp(op));
		const surfaceFallbackReason = this.surfaceFallbackReason ?? this.surfaceRequest.unsupportedReason ?? null;
		const fontSubstitutions = [...this.currentFontSubstitutions.values()].map((substitution) => ({ ...substitution }));
		const glyphRunFontDiagnostics = this.glyphRunFonts.diagnostics();
		const readinessBlockers = [];
		if (!this.lastRenderCompleted) readinessBlockers.push("renderNotCompleted");
		if (this.lastRenderError !== null) readinessBlockers.push("renderError");
		if (lastUnexpectedUnsupportedOps.length > 0) readinessBlockers.push("unexpectedUnsupportedOps");
		if (this.currentImageFailures.size > 0) readinessBlockers.push("imageReplayFailure");
		if (this.localTypefacePending.size > 0) readinessBlockers.push("localFontsPending");
		return {
			mode: this.renderMode,
			surfacePreference: this.surfaceRequest.preference,
			surfaceBackend: this.surfaceBackend,
			surfaceFallbackReason,
			lastRenderCompleted: this.lastRenderCompleted,
			lastUnsupportedOps,
			lastExpectedUnsupportedOps,
			lastUnexpectedUnsupportedOps,
			lastRenderError: this.lastRenderError,
			passesRuntimeReadinessGate: readinessBlockers.length === 0,
			readinessBlockers,
			hiddenCanvas2dOverlayUsed: false,
			lastRenderDurationMs: this.lastRenderDurationMs,
			renderCount: this.renderCount,
			imageCacheEntries: this.imageCache.size,
			imageCacheLimit: CanvasKitLayerRenderer.MAX_IMAGE_CACHE_ENTRIES,
			imageCachePixels: this.imageCachePixels,
			imageCachePixelLimit: CanvasKitLayerRenderer.MAX_IMAGE_CACHE_PIXELS,
			imageCacheHits: this.imageCacheHits,
			imageCacheMisses: this.imageCacheMisses,
			imageCacheEvictions: this.imageCacheEvictions,
			imageFailureCacheHits: this.imageFailureCacheHits,
			imageFailures: [...this.currentImageFailures.values()].map((failure) => ({ ...failure })),
			localTypefaceCount: this.localTypefaces.size,
			localTypefaceLoadFailureCount: this.localTypefaceLoadFailures.size,
			localTypefacePendingCount: this.localTypefacePending.size,
			bundledTypefaceCount: this.bundledTypefaces.size,
			bundledTypefaceLoadFailureCount: this.bundledTypefaceLoadFailures.size,
			glyphRunFontBlobCount: glyphRunFontDiagnostics.blobs,
			glyphRunFontBlobBytes: glyphRunFontDiagnostics.bytes,
			glyphRunTypefaceCount: glyphRunFontDiagnostics.typefaces,
			glyphRunFontCount: glyphRunFontDiagnostics.fonts,
			fontSubstitutionLimit: CanvasKitLayerRenderer.MAX_FONT_SUBSTITUTION_DIAGNOSTICS,
			unregisteredFontFallbacks: fontSubstitutions.filter((substitution) => substitution.kind === "unregisteredFallback").length,
			fontSubstitutions,
			replayFeatureCounts: { ...this.currentReplayFeatureCounts }
		};
	}
	resetReplayFeatureCounts() {
		this.currentReplayFeatureCounts = {
			dashedStrokes: 0,
			glyphRuns: 0,
			verticalPresentationPunctuation: 0,
			verticalTextRuns: 0
		};
	}
	recordRenderFailure(error, resetReplayState = false) {
		if (resetReplayState) {
			this.unsupportedOps.clear();
			this.currentImageFailures.clear();
			this.currentFontSubstitutions.clear();
			this.resetReplayFeatureCounts();
			this.surfaceBackend = null;
			this.surfaceFallbackReason = null;
		}
		this.lastRenderCompleted = false;
		this.lastRenderError = error instanceof Error ? error.message : String(error);
		this.unsupportedOps.add("renderPage");
	}
	dispose() {
		this.disposed = true;
		this.resetDocumentResources();
		this.defaultTypeface?.delete();
		this.symbolFallbackTypeface?.delete();
		this.defaultFontManager?.delete();
		this.oldHangulTypeface?.typeface?.delete?.();
		this.oldHangulTypeface?.fontManager?.delete?.();
	}
	makeSurface(targetCanvas) {
		this.surfaceBackend = null;
		this.surfaceFallbackReason = this.surfaceRequest.unsupportedReason ?? null;
		if (this.surfaceRequest.preference === "webgpu" && this.surfaceFallbackReason === null) this.surfaceFallbackReason = "webgpuSurfaceUnsupported";
		const reuseSoftwareFallbackCanvas = targetCanvas.classList.contains("ck-replaced");
		if (this.surfaceRequest.preference === "software" || reuseSoftwareFallbackCanvas) {
			const swSurface = this.canvasKit.MakeSWCanvasSurface(targetCanvas);
			if (swSurface) {
				this.surfaceBackend = "software";
				if (reuseSoftwareFallbackCanvas && this.surfaceFallbackReason === null) this.surfaceFallbackReason = "defaultSurfaceUnavailableUsingSoftware";
				return {
					surface: swSurface,
					canvas: targetCanvas
				};
			}
			this.surfaceFallbackReason = "softwareSurfaceUnavailable";
		}
		const originalParent = targetCanvas.parentElement;
		const originalChildIndex = originalParent ? Array.prototype.indexOf.call(originalParent.children, targetCanvas) : -1;
		try {
			const surface = this.canvasKit.MakeCanvasSurface(targetCanvas);
			if (surface) {
				const replacement = originalParent && originalChildIndex >= 0 ? originalParent.children.item(originalChildIndex) : null;
				if (targetCanvas.parentElement !== originalParent && replacement instanceof HTMLCanvasElement) {
					this.surfaceBackend = "software";
					if (this.surfaceFallbackReason === null) this.surfaceFallbackReason = "defaultSurfaceUnavailableUsingSoftware";
					return {
						surface,
						canvas: replacement
					};
				}
				this.surfaceBackend = "default";
				return {
					surface,
					canvas: targetCanvas
				};
			}
		} catch {
			if (this.surfaceFallbackReason === null) this.surfaceFallbackReason = "defaultSurfaceCreationFailed";
		}
		const internalReplacement = originalParent && originalChildIndex >= 0 ? originalParent.children.item(originalChildIndex) : null;
		let softwareCanvas = targetCanvas.parentElement !== originalParent && internalReplacement instanceof HTMLCanvasElement ? internalReplacement : targetCanvas;
		if (softwareCanvas === targetCanvas && targetCanvas.parentElement) {
			const parent = targetCanvas.parentElement;
			const replacement = targetCanvas.cloneNode(true);
			replacement.classList.add("ck-replaced");
			parent.replaceChild(replacement, targetCanvas);
			softwareCanvas = replacement;
		}
		const softwareSurface = this.canvasKit.MakeSWCanvasSurface(softwareCanvas);
		if (softwareSurface) {
			this.surfaceBackend = "software";
			if (this.surfaceFallbackReason === null) this.surfaceFallbackReason = "defaultSurfaceUnavailableUsingSoftware";
			return {
				surface: softwareSurface,
				canvas: softwareCanvas
			};
		}
		throw new Error("CanvasKit surface를 만들 수 없습니다");
	}
	selectTextVariants(node) {
		if (node.kind === "group") {
			for (const child of node.children) this.selectTextVariants(child);
			return;
		}
		if (node.kind === "clipRect") {
			this.selectTextVariants(node.child);
			return;
		}
		const selected = selectLayerTextVariantsForLeaf(node.ops, (op) => this.glyphOutlineVariantReplayable(op), (op) => this.glyphRunVariantReplayable(op));
		for (const op of selected) this.selectedTextVariantOps.add(op);
	}
	glyphRunVariantReplayable(op) {
		return this.glyphRunFonts.replayStatus(op, this.currentFontResources).replayable;
	}
	glyphOutlineVariantReplayable(op) {
		if (op.diagnostics?.strictVisualEligible !== true) return false;
		if (!glyphOutlinePayloadStatus(op, {
			allowMonochromeFillStroke: true,
			allowColrv1Stage1ColorGraph: true,
			allowBitmapGlyph: true,
			allowSvgGlyph: true
		}).supported) return false;
		if (op.payloadKind === "bitmapGlyph") {
			const imageOp = this.bitmapGlyphImageOp(op);
			return imageOp !== null && this.imageForOp(imageOp) !== null;
		}
		if (op.payloadKind === "svgGlyph") return this.staticSvgGlyphPathLayers(op) !== null;
		return op.payloadKind === "colorLayers" || op.payloadKind === "monochromeFill" || op.payloadKind === "monochromeFillStroke";
	}
	layerResourceIndex(id, keys, length) {
		if (typeof id === "number" && Number.isInteger(id) && id >= 0 && id < length) return id;
		if (typeof id !== "string") return null;
		const index = keys?.indexOf(id) ?? -1;
		return index >= 0 && index < length ? index : null;
	}
	bitmapGlyphImageOp(op) {
		const payload = op.bitmapGlyph;
		const resources = this.currentResources;
		const index = this.layerResourceIndex(payload?.imageResourceId ?? payload?.imageRef, resources?.imageKeys, resources?.images?.length ?? 0);
		if (!payload || index === null || !payload.placement) return null;
		const base64 = resources?.images?.[index];
		const resourceKey = resources?.imageKeys?.[index];
		const payloadResourceKey = glyphOutlinePayloadResourceKey(op);
		let bytes;
		try {
			if (typeof base64 !== "string" || base64.length > CanvasKitLayerRenderer.MAX_BITMAP_GLYPH_BASE64_LENGTH) return null;
			bytes = base64ToBytes(base64);
		} catch {
			return null;
		}
		if (typeof resourceKey !== "string" || payloadResourceKey === null || op.payloadResourceKey !== `${payloadResourceKey}:resource:${resourceKey}` || !layerResourceKeyMatches("img", resourceKey, bytes)) return null;
		return {
			type: "image",
			bbox: payload.placement,
			base64,
			imageRef: `glyph:${resourceKey}`,
			fillMode: "fitToSize"
		};
	}
	staticSvgGlyphPathLayers(op) {
		const payload = op.svgGlyph;
		const resources = this.currentResources;
		const index = this.layerResourceIndex(payload?.vectorResourceId ?? payload?.svgRef, resources?.svgKeys, resources?.svgFragments?.length ?? 0);
		if (!payload || index === null) return null;
		const fragment = resources?.svgFragments?.[index];
		const resourceKey = resources?.svgKeys?.[index];
		const payloadResourceKey = glyphOutlinePayloadResourceKey(op);
		if (typeof fragment !== "string" || fragment.length > CanvasKitLayerRenderer.MAX_STATIC_SVG_GLYPH_BYTES) return null;
		const fragmentBytes = new TextEncoder().encode(fragment);
		if (fragmentBytes.byteLength > CanvasKitLayerRenderer.MAX_STATIC_SVG_GLYPH_BYTES || typeof resourceKey !== "string" || payloadResourceKey === null || op.payloadResourceKey !== `${payloadResourceKey}:resource:${resourceKey}` || !layerResourceKeyMatches("svg", resourceKey, fragmentBytes)) return null;
		const cached = this.svgGlyphPathCache.get(resourceKey);
		if (cached) {
			this.svgGlyphPathCache.delete(resourceKey);
			this.svgGlyphPathCache.set(resourceKey, cached);
			return cached;
		}
		if (this.svgGlyphParseFailures.has(resourceKey)) return null;
		const layers = parseStaticSvgPathLayers(fragment, op.paintStyle?.color ?? "#000000");
		if (layers.length === 0) {
			this.rememberSvgGlyphParseFailure(resourceKey);
			return null;
		}
		if (!staticSvgPathLayersAreReplayable(layers, (pathData) => this.canvasKit.Path.MakeFromSVGString(pathData))) {
			this.rememberSvgGlyphParseFailure(resourceKey);
			return null;
		}
		if (this.svgGlyphPathCache.size >= CanvasKitLayerRenderer.MAX_SVG_GLYPH_CACHE_ENTRIES) {
			const oldestKey = this.svgGlyphPathCache.keys().next().value;
			if (oldestKey !== void 0) this.svgGlyphPathCache.delete(oldestKey);
		}
		this.svgGlyphPathCache.set(resourceKey, layers);
		return layers;
	}
	rememberSvgGlyphParseFailure(resourceKey) {
		if (this.svgGlyphParseFailures.size >= CanvasKitLayerRenderer.MAX_SVG_GLYPH_CACHE_ENTRIES) {
			const oldestKey = this.svgGlyphParseFailures.values().next().value;
			if (oldestKey !== void 0) this.svgGlyphParseFailures.delete(oldestKey);
		}
		this.svgGlyphParseFailures.add(resourceKey);
	}
	renderNode(canvas, node, profile, replayPlane, inheritedLayer = null, rightOverflowSlop) {
		const activeLayer = node.layer ?? inheritedLayer;
		if (node.kind === "group") {
			for (const child of node.children) this.renderNode(canvas, child, profile, replayPlane, activeLayer, rightOverflowSlop);
			return;
		}
		if (node.kind === "clipRect") {
			this.renderClipNode(canvas, node, profile, replayPlane, activeLayer, rightOverflowSlop);
			return;
		}
		this.renderLeaf(canvas, node, profile, replayPlane, activeLayer);
	}
	renderClipNode(canvas, node, profile, replayPlane, inheritedLayer, rightOverflowSlop) {
		const pad = canvaskitClipRightPad(this.renderMode, profile, node.clipKind, rightOverflowSlop);
		const clip = {
			...node.clip,
			width: node.clip.width + pad
		};
		canvas.save();
		canvas.clipRect(this.rect(clip), this.canvasKit.ClipOp?.Intersect ?? 0, true);
		this.renderNode(canvas, node.child, profile, replayPlane, inheritedLayer, rightOverflowSlop);
		canvas.restore();
	}
	renderLeaf(canvas, node, profile, replayPlane, inheritedLayer) {
		const activeLayer = node.layer ?? inheritedLayer;
		for (const op of node.ops) {
			if (layerPaintOpReplayPlane(op, activeLayer) !== replayPlane) continue;
			if (("variant" in op ? op.variant?.equivalenceGroup : void 0) && !this.selectedTextVariantOps.has(op)) continue;
			this.renderOp(canvas, op, profile);
		}
	}
	renderOp(canvas, op, profile) {
		switch (op.type) {
			case "pageBackground":
				this.renderPageBackground(canvas, op);
				return;
			case "rectangle":
				this.renderRectangle(canvas, op);
				return;
			case "ellipse":
				this.renderEllipse(canvas, op);
				return;
			case "line":
				this.renderLine(canvas, op);
				return;
			case "path":
				this.renderPath(canvas, op);
				return;
			case "image":
				this.renderImage(canvas, op);
				return;
			case "textRun":
				this.renderTextRun(canvas, op);
				return;
			case "footnoteMarker":
				this.renderTextRun(canvas, {
					type: "textRun",
					bbox: op.bbox,
					text: op.text,
					baseline: op.fontSize ?? 7,
					style: {
						fontFamily: op.fontFamily,
						fontSize: op.fontSize,
						color: op.color
					}
				});
				return;
			case "formObject":
				this.renderFormObject(canvas, op);
				return;
			case "placeholder":
				this.renderPlaceholder(canvas, op, profile);
				return;
			case "equation":
				this.renderEquation(canvas, op);
				return;
			case "rawSvg":
				this.unsupportedOps.add("rawSvg:unsupportedDirectReplay");
				return;
			case "charOverlap":
				this.renderCharOverlap(canvas, op);
				return;
			case "tabLeader":
				this.renderTabLeader(canvas, op);
				return;
			case "textControlMark":
				this.renderTextControlMark(canvas, op);
				return;
			case "textDecoration":
				this.renderTextDecoration(canvas, op);
				return;
			case "glyphRun":
				this.renderGlyphRun(canvas, op);
				return;
			case "glyphOutline": {
				const status = glyphOutlinePayloadStatus(op, {
					allowMonochromeFillStroke: true,
					allowColrv1Stage1ColorGraph: true,
					allowBitmapGlyph: true,
					allowSvgGlyph: true
				});
				if (status.supported && this.glyphOutlineVariantReplayable(op)) {
					this.renderGlyphOutline(canvas, op);
					return;
				}
				this.unsupportedOps.add(status.reason ? `glyphOutline:${status.reason}` : "glyphOutline");
				return;
			}
			default: this.unsupportedOps.add(op.type ?? "unknown");
		}
	}
	renderPageBackground(canvas, op) {
		if (op.backgroundColor) {
			const paint = this.makeFillPaint(op.backgroundColor);
			canvas.drawRect(this.rect(op.bbox), paint);
			paint.delete?.();
		}
		if (op.borderColor && (op.borderWidth ?? 0) > 0) {
			const paint = this.makeStrokePaint(op.borderColor, op.borderWidth ?? 1);
			canvas.drawRect(this.rect(op.bbox), paint);
			paint.delete?.();
		}
	}
	renderRectangle(canvas, op) {
		this.drawStyledShape(canvas, op.bbox, op.style, (paint) => {
			const cornerRadius = op.cornerRadius ?? 0;
			if (cornerRadius > 0) canvas.drawRRect(this.canvasKit.RRectXY(this.rect(op.bbox), cornerRadius, cornerRadius), paint);
			else canvas.drawRect(this.rect(op.bbox), paint);
		});
	}
	renderEllipse(canvas, op) {
		this.drawStyledShape(canvas, op.bbox, op.style, (paint) => {
			canvas.drawOval(this.rect(op.bbox), paint);
		});
	}
	renderLine(canvas, op) {
		const paint = this.makeStrokePaint(op.style?.color ?? "#000000", op.style?.width ?? 1);
		try {
			this.drawStrokeWithDash(op.style?.dash, paint, () => {
				canvas.drawLine(op.x1, op.y1, op.x2, op.y2, paint);
			});
		} finally {
			paint.delete?.();
		}
	}
	renderPath(canvas, op) {
		const path = new this.canvasKit.Path();
		let currentX = op.bbox.x;
		let currentY = op.bbox.y;
		for (const command of op.commands ?? []) [currentX, currentY] = this.applyPathCommand(path, command, currentX, currentY);
		const style = op.style ?? (op.lineStyle ? {} : {
			strokeColor: "#000000",
			strokeWidth: 1,
			fillColor: null
		});
		const replayStyle = {
			...style,
			strokeColor: style.strokeColor ?? op.lineStyle?.color,
			strokeWidth: op.lineStyle?.width ?? style.strokeWidth,
			strokeDash: op.lineStyle?.dash ?? style.strokeDash
		};
		const tr = op.transform;
		const rotation = tr?.rotation ?? 0;
		const horzFlip = tr?.horzFlip ?? false;
		const vertFlip = tr?.vertFlip ?? false;
		const needsTransform = rotation !== 0 || horzFlip || vertFlip;
		if (needsTransform) {
			const cx = op.bbox.x + (op.bbox.width ?? 0) / 2;
			const cy = op.bbox.y + (op.bbox.height ?? 0) / 2;
			canvas.save();
			if (horzFlip || vertFlip) {
				canvas.translate(cx, cy);
				canvas.scale(horzFlip ? -1 : 1, vertFlip ? -1 : 1);
				canvas.translate(-cx, -cy);
			}
			if (rotation !== 0) canvas.rotate(rotation, cx, cy);
		}
		this.drawStyledPath(canvas, path, replayStyle);
		if (needsTransform) canvas.restore();
		path.delete?.();
	}
	applyPathCommand(path, command, currentX, currentY) {
		switch (command.type) {
			case "moveTo":
				path.moveTo(command.x, command.y);
				return [command.x, command.y];
			case "lineTo":
				path.lineTo(command.x, command.y);
				return [command.x, command.y];
			case "curveTo":
				path.cubicTo(command.x1, command.y1, command.x2, command.y2, command.x3, command.y3);
				return [command.x3, command.y3];
			case "arcTo":
				if (typeof path.arcToRotated === "function") path.arcToRotated(command.rx, command.ry, command.rotation, command.largeArc, command.sweep, command.x, command.y);
				else path.lineTo(command.x, command.y);
				return [command.x, command.y];
			case "closePath":
				path.close();
				return [currentX, currentY];
		}
	}
	renderImage(canvas, op) {
		if (!op.base64) {
			this.recordImageFailure(op, "dataMissing", null);
			this.unsupportedOps.add("image:dataMissing");
			return;
		}
		const image = this.imageForOp(op);
		if (!image) {
			this.unsupportedOps.add("image:decodeFailed");
			return;
		}
		this.recordImageCoverageGaps(op);
		this.withImageTransform(canvas, op.bbox, op.transform, () => this.drawImageOp(canvas, image, op));
	}
	renderGlyphRun(canvas, op) {
		const font = this.glyphRunFonts.font(op, this.currentFontResources);
		if (!font) {
			this.unsupportedOps.add("glyphRun:replayInvariant");
			return;
		}
		const paint = this.makeFillPaint(op.paintStyle.color ?? "#000000");
		try {
			if (drawCanvasKitGlyphRun(canvas, op, font, paint)) this.currentReplayFeatureCounts.glyphRuns += 1;
			else this.unsupportedOps.add("glyphRun:replayFailed");
		} finally {
			paint.delete?.();
		}
	}
	renderGlyphOutline(canvas, op) {
		if (op.payloadKind === "bitmapGlyph") {
			this.renderBitmapGlyphOutline(canvas, op);
			return;
		}
		if (op.payloadKind === "svgGlyph") {
			this.renderSvgGlyphOutline(canvas, op);
			return;
		}
		if (op.payloadKind === "monochromeFill" || op.payloadKind === "monochromeFillStroke") {
			this.renderMonochromeGlyphOutline(canvas, op);
			return;
		}
		const graph = op.colorLayers?.paintGraph;
		const nodes = graph?.nodes ?? [];
		if (!graph || nodes.length === 0 || graph.rootNodeId === void 0) {
			this.unsupportedOps.add("glyphOutline:replayInvariant");
			return;
		}
		const nodesById = /* @__PURE__ */ new Map();
		for (const node of nodes) if (node.nodeId !== void 0) nodesById.set(node.nodeId, node);
		canvas.save();
		const matrix = this.affineToCanvasKitMatrix(op.placement?.runToPage);
		if (matrix) canvas.concat?.(matrix);
		try {
			this.renderColorPaintGraphNode(canvas, nodesById, graph.rootNodeId, /* @__PURE__ */ new Set());
		} finally {
			canvas.restore();
		}
	}
	renderBitmapGlyphOutline(canvas, op) {
		const imageOp = this.bitmapGlyphImageOp(op);
		const image = imageOp ? this.imageForOp(imageOp) : null;
		if (!imageOp || !image) {
			this.unsupportedOps.add("glyphOutline:bitmapReplayInvariant");
			return;
		}
		canvas.save();
		try {
			const transform = op.bitmapGlyph?.transformToRun;
			const matrix = this.affineToCanvasKitMatrix(transform);
			if (matrix) canvas.concat(matrix);
			this.drawImageOp(canvas, image, imageOp);
		} finally {
			canvas.restore();
		}
	}
	renderSvgGlyphOutline(canvas, op) {
		const payload = op.svgGlyph;
		const viewBox = payload?.viewBox;
		const layers = this.staticSvgGlyphPathLayers(op);
		if (!payload || !viewBox || !layers || !this.boundsAreDrawable(op.bbox) || !this.boundsAreDrawable(viewBox)) {
			this.unsupportedOps.add("glyphOutline:svgReplayInvariant");
			return;
		}
		canvas.save();
		try {
			const payloadMatrix = this.affineToCanvasKitMatrix(payload.transformToRun);
			if (payloadMatrix) canvas.concat(payloadMatrix);
			canvas.translate(op.bbox.x, op.bbox.y);
			canvas.scale(op.bbox.width / viewBox.width, op.bbox.height / viewBox.height);
			canvas.translate(-viewBox.x, -viewBox.y);
			for (const layer of layers) {
				canvas.save();
				let path = null;
				try {
					const layerMatrix = this.affineToCanvasKitMatrix(layer.transform);
					if (layerMatrix) canvas.concat(layerMatrix);
					path = this.canvasKit.Path.MakeFromSVGString(layer.pathData);
					if (!path) continue;
					this.applyGlyphPathFillRule(path, layer.fillRule);
					if (layer.fill !== null) {
						let paint = null;
						try {
							paint = this.makeFillPaint(layer.fill, layer.opacity);
							canvas.drawPath(path, paint);
						} finally {
							paint?.delete?.();
						}
					}
					if (layer.stroke) {
						const stroke = layer.stroke;
						let paint = null;
						let effect = null;
						try {
							paint = this.makeStrokePaint(stroke.color, stroke.width, stroke.opacity);
							paint.setStrokeJoin(this.canvasKit.StrokeJoin[stroke.lineJoin === "round" ? "Round" : stroke.lineJoin === "bevel" ? "Bevel" : "Miter"]);
							paint.setStrokeCap(this.canvasKit.StrokeCap[stroke.lineCap === "round" ? "Round" : stroke.lineCap === "square" ? "Square" : "Butt"]);
							paint.setStrokeMiter(stroke.miterLimit);
							effect = stroke.dashArray ? this.canvasKit.PathEffect.MakeDash(stroke.dashArray, stroke.dashOffset) : null;
							if (effect) paint.setPathEffect(effect);
							canvas.drawPath(path, paint);
						} finally {
							effect?.delete?.();
							paint?.delete?.();
						}
					}
				} finally {
					path?.delete?.();
					canvas.restore();
				}
			}
		} finally {
			canvas.restore();
		}
	}
	renderMonochromeGlyphOutline(canvas, op) {
		const matrix = this.affineToCanvasKitMatrix(op.placement?.runToPage);
		if (!matrix || !op.paths?.length) {
			this.unsupportedOps.add("glyphOutline:replayInvariant");
			return;
		}
		const fill = this.makeFillPaint(op.paintStyle?.color ?? "#000000");
		const stroke = op.payloadKind === "monochromeFillStroke" && op.stroke ? this.makeStrokePaint(op.stroke.color ?? op.paintStyle?.color ?? "#000000", op.stroke.width ?? 1) : null;
		canvas.save();
		try {
			canvas.concat(matrix);
			for (const outline of op.paths) {
				const path = new this.canvasKit.Path();
				let currentX = 0;
				let currentY = 0;
				try {
					for (const command of outline.commands ?? []) [currentX, currentY] = this.applyPathCommand(path, command, currentX, currentY);
					this.applyGlyphPathFillRule(path, outline.fillRule);
					canvas.drawPath(path, fill);
					if (stroke) canvas.drawPath(path, stroke);
				} finally {
					path.delete?.();
				}
			}
		} finally {
			canvas.restore();
			stroke?.delete?.();
			fill.delete?.();
		}
	}
	applyGlyphPathFillRule(path, fillRule) {
		path.setFillType(fillRule === "evenodd" ? this.canvasKit.FillType.EvenOdd : this.canvasKit.FillType.Winding);
	}
	renderColorPaintGraphNode(canvas, nodesById, nodeId, visited) {
		if (visited.has(nodeId)) {
			this.unsupportedOps.add("glyphOutline:replayInvariant");
			return;
		}
		visited.add(nodeId);
		const node = nodesById.get(nodeId);
		if (!node) {
			this.unsupportedOps.add("glyphOutline:replayInvariant");
			return;
		}
		if (node.kind === "transform") {
			const transformNode = node.transform;
			const matrix = this.affineToCanvasKitMatrix(transformNode?.transform);
			if (!matrix || transformNode?.childNodeId === void 0) {
				this.unsupportedOps.add("glyphOutline:replayInvariant");
				return;
			}
			canvas.save();
			canvas.concat?.(matrix);
			try {
				this.renderColorPaintGraphNode(canvas, nodesById, transformNode.childNodeId, visited);
			} finally {
				canvas.restore();
			}
			return;
		}
		const pathNode = node.solidPath ?? node.linearGradientPath ?? node.radialGradientPath ?? node.sweepGradientPath;
		if (!pathNode?.commands) {
			this.unsupportedOps.add("glyphOutline:replayInvariant");
			return;
		}
		const path = new this.canvasKit.Path();
		let currentX = 0;
		let currentY = 0;
		for (const command of pathNode.commands) [currentX, currentY] = this.applyPathCommand(path, command, currentX, currentY);
		this.applyFillRule(path, pathNode.fillRule);
		const paint = new this.canvasKit.Paint();
		let shader;
		try {
			paint.setAntiAlias?.(true);
			paint.setStyle(this.canvasKit.PaintStyle.Fill);
			if (node.kind === "solidPath" && node.solidPath?.fill) paint.setColor(this.resolvedColor(node.solidPath.fill));
			else if (node.kind === "linearGradientPath" && node.linearGradientPath?.gradient) {
				shader = this.makeLinearGradientShader(node.linearGradientPath.gradient);
				if (!shader) return;
				paint.setShader(shader);
			} else if (node.kind === "radialGradientPath" && node.radialGradientPath?.gradient) {
				shader = this.makeRadialGradientShader(node.radialGradientPath.gradient);
				if (!shader) return;
				paint.setShader(shader);
			} else if (node.kind === "sweepGradientPath" && node.sweepGradientPath?.gradient) {
				shader = this.makeSweepGradientShader(node.sweepGradientPath.gradient);
				if (!shader) return;
				paint.setShader(shader);
			} else return;
			canvas.drawPath(path, paint);
		} finally {
			shader?.delete?.();
			paint.delete?.();
			path.delete?.();
		}
	}
	affineToCanvasKitMatrix(transform) {
		if (!transform) return null;
		return [
			transform.a,
			transform.c,
			transform.e,
			transform.b,
			transform.d,
			transform.f,
			0,
			0,
			1
		];
	}
	applyFillRule(path, fillRule) {
		if (fillRule === "evenodd") path.setFillType?.(this.canvasKit.FillType.EvenOdd);
	}
	resolvedColor(color) {
		const rgba = color.rgba ?? [
			0,
			0,
			0,
			1
		];
		return this.canvasKit.Color(clampUnit(rgba[0]), clampUnit(rgba[1]), clampUnit(rgba[2]), clampUnit(rgba[3]));
	}
	makeLinearGradientShader(gradient) {
		return this.canvasKit.Shader.MakeLinearGradient?.([gradient?.x0 ?? 0, gradient?.y0 ?? 0], [gradient?.x1 ?? 0, gradient?.y1 ?? 0], gradientColors(gradient?.stops), gradientPositions(gradient?.stops), this.canvasKit.TileMode.Clamp);
	}
	makeRadialGradientShader(gradient) {
		return this.canvasKit.Shader.MakeRadialGradient?.([gradient?.cx ?? 0, gradient?.cy ?? 0], gradient?.radius ?? 1, gradientColors(gradient?.stops), gradientPositions(gradient?.stops), this.canvasKit.TileMode.Clamp);
	}
	makeSweepGradientShader(gradient) {
		return this.canvasKit.Shader.MakeSweepGradient?.(gradient?.cx ?? 0, gradient?.cy ?? 0, gradientColors(gradient?.stops), gradientPositions(gradient?.stops), this.canvasKit.TileMode.Clamp, null, 0, gradient?.startAngleDegrees ?? 0, gradient?.endAngleDegrees ?? 360);
	}
	drawImageOp(canvas, image, op) {
		const imageWithDimensions = image;
		const widthMember = imageWithDimensions.width;
		const heightMember = imageWithDimensions.height;
		const imageWidth = typeof widthMember === "function" ? widthMember.call(image) : typeof widthMember === "number" ? widthMember : null;
		const imageHeight = typeof heightMember === "function" ? heightMember.call(image) : typeof heightMember === "number" ? heightMember : null;
		if (!this.boundsAreDrawable(op.bbox)) {
			this.unsupportedOps.add("image:invalidBounds");
			return;
		}
		if (imageWidth === null || imageHeight === null || !Number.isFinite(imageWidth) || !Number.isFinite(imageHeight) || imageWidth <= 0 || imageHeight <= 0) {
			const paint = new this.canvasKit.Paint();
			paint.setAntiAlias?.(true);
			try {
				canvas.drawImage(image, op.bbox.x, op.bbox.y, paint);
				this.unsupportedOps.add("image:dimensionUnavailable");
			} finally {
				paint.delete?.();
			}
			return;
		}
		const crop = canvasKitImageSourceRect(imageWidth, imageHeight, op.crop, op.originalSizeHu);
		const opacity = Number.isFinite(op.opacity) ? Math.max(0, Math.min(1, op.opacity ?? 1)) : 1;
		const drawImage = (dstX, dstY, dstW, dstH) => {
			const src = crop ? this.canvasKit.XYWHRect(crop.x, crop.y, crop.width, crop.height) : this.canvasKit.XYWHRect(0, 0, imageWidth, imageHeight);
			this.drawImageRect(canvas, image, src, this.canvasKit.XYWHRect(dstX, dstY, dstW, dstH), opacity);
		};
		const fillMode = op.fillMode ?? "fitToSize";
		if (canvasKitImageFillModeStretches(fillMode)) {
			drawImage(op.bbox.x, op.bbox.y, op.bbox.width, op.bbox.height);
			return;
		}
		let tileWidth = op.originalSize?.width ?? imageWidth;
		let tileHeight = op.originalSize?.height ?? imageHeight;
		if (!Number.isFinite(tileWidth) || tileWidth <= 0) tileWidth = imageWidth;
		if (!Number.isFinite(tileHeight) || tileHeight <= 0) tileHeight = imageHeight;
		canvas.save();
		try {
			canvas.clipRect(this.rect(op.bbox), this.canvasKit.ClipOp?.Intersect ?? 0, true);
			if (canvasKitImageFillModeTiles(fillMode)) this.drawTiledImage(canvas, op.bbox, fillMode, tileWidth, tileHeight, drawImage);
			else {
				const placed = canvasKitImagePlacement(fillMode, op.bbox, tileWidth, tileHeight);
				drawImage(placed.x, placed.y, tileWidth, tileHeight);
			}
		} finally {
			canvas.restore();
		}
	}
	drawImageRect(canvas, image, source, dest, opacity = 1) {
		const paint = new this.canvasKit.Paint();
		paint.setAntiAlias?.(true);
		if (opacity < 1) paint.setAlphaf(opacity);
		try {
			canvas.drawImageRect(image, source, dest, paint);
		} finally {
			paint.delete?.();
		}
	}
	drawTiledImage(canvas, bbox, fillMode, tileWidth, tileHeight, drawImage) {
		const maxTileDraws = CanvasKitLayerRenderer.MAX_IMAGE_TILE_DRAWS;
		let tileDraws = 0;
		const drawTile = (x, y) => {
			if (tileDraws >= maxTileDraws) return;
			drawImage(x, y, tileWidth, tileHeight);
			tileDraws += 1;
		};
		if (fillMode === "tileAll") for (let y = bbox.y; y < bbox.y + bbox.height && tileDraws < maxTileDraws; y += tileHeight) for (let x = bbox.x; x < bbox.x + bbox.width && tileDraws < maxTileDraws; x += tileWidth) drawTile(x, y);
		else if (fillMode === "tileHorzTop" || fillMode === "tileHorzBottom") {
			const y = fillMode === "tileHorzTop" ? bbox.y : bbox.y + bbox.height - tileHeight;
			for (let x = bbox.x; x < bbox.x + bbox.width && tileDraws < maxTileDraws; x += tileWidth) drawTile(x, y);
		} else {
			const x = fillMode === "tileVertLeft" ? bbox.x : bbox.x + bbox.width - tileWidth;
			for (let y = bbox.y; y < bbox.y + bbox.height && tileDraws < maxTileDraws; y += tileHeight) drawTile(x, y);
		}
		if (tileDraws >= maxTileDraws) this.unsupportedOps.add("image:tileLimit");
	}
	withImageTransform(canvas, bounds, transform, draw) {
		const rotation = transform?.rotation ?? 0;
		const horzFlip = transform?.horzFlip ?? false;
		const vertFlip = transform?.vertFlip ?? false;
		if (rotation === 0 && !horzFlip && !vertFlip) {
			draw();
			return;
		}
		const cx = bounds.x + bounds.width / 2;
		const cy = bounds.y + bounds.height / 2;
		canvas.save();
		try {
			if (horzFlip || vertFlip) {
				canvas.translate(cx, cy);
				canvas.scale(horzFlip ? -1 : 1, vertFlip ? -1 : 1);
				canvas.translate(-cx, -cy);
			}
			if (rotation !== 0) canvas.rotate(rotation, cx, cy);
			draw();
		} finally {
			canvas.restore();
		}
	}
	recordImageCoverageGaps(op) {
		if (op.bakedWatermark) return;
		if (op.effect && op.effect !== "realPic") this.unsupportedOps.add(`imageEffect:${op.effect}`);
		if ((op.brightness ?? 0) !== 0 || (op.contrast ?? 0) !== 0) this.unsupportedOps.add("imageEffect:brightnessContrast");
	}
	recordTextRunCoverageGaps(op, codePoints) {
		const style = op.style ?? {};
		const decorationsAreExternal = op.legacyVisuals?.decorations === "mirror";
		if (!decorationsAreExternal && style.underline && style.underline !== "none") this.unsupportedOps.add("textRun:textDecoration");
		if (!decorationsAreExternal && style.strikethrough) this.unsupportedOps.add("textRun:textDecoration");
		if (!decorationsAreExternal && style.emphasisDot && style.emphasisDot !== 0) this.unsupportedOps.add("textRun:emphasisDot");
		const replayText = op.displayText ?? op.text;
		const hasOldHangul = codePoints.some((character) => {
			const codePoint = character.codePointAt(0) ?? 0;
			return codePoint >= 4352 && codePoint <= 4607 || codePoint >= 43360 && codePoint <= 43391 || codePoint >= 55216 && codePoint <= 55295;
		});
		const hasBoxedPua = codePoints.some((character) => {
			const codePoint = character.codePointAt(0) ?? 0;
			return codePoint >= 983729 && codePoint <= 983748;
		});
		const requiresUnsupportedShaping = textRequiresComplexShaping(replayText) || textRunHasPaintEffects(style) && (hasOldHangul || hasBoxedPua);
		if (requiresUnsupportedShaping) this.unsupportedOps.add("textRun:scriptTextRequiresShaping");
		return requiresUnsupportedShaping;
	}
	boundsAreDrawable(bounds) {
		return Number.isFinite(bounds.x) && Number.isFinite(bounds.y) && Number.isFinite(bounds.width) && Number.isFinite(bounds.height) && bounds.width > 0 && bounds.height > 0;
	}
	renderTextRun(canvas, op) {
		if (op.charOverlap && op.legacyVisuals?.charOverlap === "mirror") return;
		if (op.charOverlap) {
			this.renderCharOverlap(canvas, {
				type: "charOverlap",
				bbox: op.bbox,
				text: op.text,
				baseline: op.baseline ?? op.style?.fontSize ?? 12,
				rotation: op.rotation ?? 0,
				isVertical: op.isVertical === true,
				style: op.style ?? {},
				positions: op.positions ?? [],
				positionsComplete: op.positions !== void 0,
				charOverlap: op.charOverlap
			});
			return;
		}
		const replayText = op.displayText ?? op.text;
		const replayPositions = op.displayText !== void 0 ? op.displayPositions : op.positions;
		if (!replayText) return;
		const replayCodePoints = [];
		for (const character of replayText) {
			if (replayCodePoints.length >= CanvasKitLayerRenderer.MAX_TEXT_RUN_CODE_POINTS) {
				this.unsupportedOps.add("textRun:visualItemLimitExceeded");
				return;
			}
			replayCodePoints.push(character);
		}
		const style = op.style ?? {};
		if (this.recordTextRunCoverageGaps(op, replayCodePoints)) return;
		const ratio = style.ratio ?? 1;
		const outlineType = style.outlineType ?? 0;
		const shadowType = style.shadowType ?? 0;
		const shadowOffsetX = style.shadowOffsetX ?? 0;
		const shadowOffsetY = style.shadowOffsetY ?? 0;
		const shadeColor = (style.shadeColor ?? "#ffffff").toLowerCase();
		const baseFontSize = style.fontSize ?? Math.max(1, op.bbox.height || 12);
		const baseline = op.baseline ?? baseFontSize;
		const rotation = op.rotation ?? 0;
		if (![
			op.bbox.x,
			op.bbox.y,
			op.bbox.width,
			op.bbox.height,
			ratio,
			outlineType,
			shadowType,
			shadowOffsetX,
			shadowOffsetY,
			baseFontSize,
			baseline,
			rotation
		].every(Number.isFinite) || op.bbox.width < 0 || op.bbox.height < 0 || ratio <= 0 || baseFontSize <= 0 || !Number.isInteger(outlineType) || outlineType < 0 || !Number.isInteger(shadowType) || shadowType < 0) {
			this.unsupportedOps.add("textRun:invalidGeometry");
			return;
		}
		const verticalPresentationText = op.isVertical && op.orientation !== "vertical-sideways" ? VERTICAL_PRESENTATION_BASE_TEXT.get(replayText) : void 0;
		const glyphReplayText = verticalPresentationText ?? replayText;
		const codePoints = verticalPresentationText === void 0 ? replayCodePoints : [verticalPresentationText];
		const hasOldHangul = codePoints.some((codePoint) => {
			const code = codePoint.codePointAt(0) ?? 0;
			return code >= 4352 && code <= 4607 || code >= 43360 && code <= 43391 || code >= 55216 && code <= 55295;
		});
		const effectPaints = [];
		let fontSize = baseFontSize;
		let baselineShift = 0;
		if (style.superscript) {
			fontSize = baseFontSize * .7;
			baselineShift -= baseFontSize * .3;
		} else if (style.subscript) {
			fontSize = baseFontSize * .7;
			baselineShift += baseFontSize * .15;
		}
		const placementMatrix = this.affineToCanvasKitMatrix(op.placement?.runToPage);
		const originX = placementMatrix ? 0 : op.bbox.x;
		const originY = placementMatrix ? op.placement?.baselineY ?? 0 : op.bbox.y + baseline;
		const needsPreservedAdvances = style.superscript || style.subscript;
		const hasLayoutPositions = replayPositions?.length === codePoints.length + 1 && replayPositions.every(Number.isFinite);
		const requestedFontFamily = primaryFontFamily(style.fontFamily);
		const preparedTypeface = this.findPreparedTypeface(requestedFontFamily);
		if (requestedFontFamily && !preparedTypeface && this.requirePreparedFontFamilies) throw new Error(`CanvasKit font family가 준비되지 않았습니다: ${requestedFontFamily}`);
		if (requestedFontFamily && !preparedTypeface) this.recordFontSubstitution({
			requestedFamily: requestedFontFamily,
			resolvedFamily: this.defaultFontFamily ?? "CanvasKit default",
			source: "unregisteredDefault",
			kind: "unregisteredFallback"
		});
		const typeface = preparedTypeface?.typeface ?? this.defaultTypeface;
		const fontManager = preparedTypeface?.fontManager ?? this.defaultFontManager;
		const paint = this.makeFillPaint(style.color ?? "#000000");
		let font = null;
		const fallbackFonts = [];
		let boxedPuaFont = null;
		let boxedPuaStrokePaint = null;
		let canvasSaved = false;
		try {
			paint.setAntiAlias?.(true);
			if (!typeface && !fontManager && !this.symbolFallbackTypeface && /[^\u0000-\u00ff]/.test(replayText)) {
				this.unsupportedOps.add("textRunFont");
				return;
			}
			canvas.save();
			canvasSaved = true;
			if (placementMatrix) canvas.concat(placementMatrix);
			else if (rotation !== 0) canvas.rotate(rotation, originX, originY);
			{
				const adjustFont = (target) => {
					const adjustable = target;
					adjustable.setEmbolden?.(style.bold === true);
					adjustable.setSkewX?.(style.italic === true ? -.2 : 0);
					adjustable.setScaleX?.(ratio);
				};
				font = new this.canvasKit.Font(typeface, fontSize);
				adjustFont(font);
				const candidateFonts = [font];
				const candidateFontSources = ["unregisteredDefault"];
				const candidateFontFamilies = [preparedTypeface?.fontFamily ?? this.defaultFontFamily ?? "CanvasKit default"];
				let candidateGlyphIds = [];
				const fallbackSpans = [];
				let oldHangulTypeface = null;
				if (hasLayoutPositions) {
					const primaryGlyphIds = font.getGlyphIDs(glyphReplayText, codePoints.length);
					candidateGlyphIds = [primaryGlyphIds];
					oldHangulTypeface = hasOldHangul ? this.findPreparedTypeface(OLD_HANGUL_FONT_FAMILY) : null;
					if (primaryGlyphIds.some((glyphId) => glyphId === 0) && this.defaultTypeface !== null && typeface !== this.defaultTypeface) {
						const defaultFont = new this.canvasKit.Font(this.defaultTypeface, fontSize);
						adjustFont(defaultFont);
						fallbackFonts.push(defaultFont);
						candidateFonts.push(defaultFont);
						candidateFontSources.push("missingGlyphDefault");
						candidateFontFamilies.push(this.defaultFontFamily ?? "CanvasKit default");
						candidateGlyphIds.push(defaultFont.getGlyphIDs(glyphReplayText, codePoints.length));
					}
					if (codePoints.some((_, index) => candidateGlyphIds.every((ids) => (ids[index] ?? 0) === 0)) && this.symbolFallbackTypeface !== null && typeface !== this.symbolFallbackTypeface && this.defaultTypeface !== this.symbolFallbackTypeface) {
						const symbolFont = new this.canvasKit.Font(this.symbolFallbackTypeface, fontSize);
						adjustFont(symbolFont);
						fallbackFonts.push(symbolFont);
						candidateFonts.push(symbolFont);
						candidateFontSources.push("missingGlyphSymbol");
						candidateFontFamilies.push("CanvasKit symbol fallback");
						candidateGlyphIds.push(symbolFont.getGlyphIDs(glyphReplayText, codePoints.length));
					}
					const selectedFontIndices = codePoints.map((codePoint, index) => {
						const code = codePoint.codePointAt(0) ?? 0;
						if (code >= 4352 && code <= 4607 || code >= 43360 && code <= 43391 || code >= 55216 && code <= 55295) return -2;
						const candidateIndex = candidateGlyphIds.findIndex((ids) => (ids[index] ?? 0) !== 0);
						if (candidateIndex >= 0) return candidateIndex;
						return code >= 983729 && code <= 983748 ? -1 : 0;
					});
					for (const fontIndex of new Set(selectedFontIndices)) if (fontIndex > 0) this.recordFontSubstitution({
						requestedFamily: requestedFontFamily || this.defaultFontFamily || "CanvasKit default",
						resolvedFamily: candidateFontFamilies[fontIndex],
						source: candidateFontSources[fontIndex],
						kind: "glyphCoverageFallback"
					});
					else if (fontIndex === -2 && oldHangulTypeface?.fontManager) this.recordFontSubstitution({
						requestedFamily: requestedFontFamily || this.defaultFontFamily || "CanvasKit default",
						resolvedFamily: oldHangulTypeface.fontFamily ?? OLD_HANGUL_FONT_FAMILY,
						source: "oldHangul",
						kind: "glyphCoverageFallback"
					});
					let spanStart = 0;
					while (spanStart < codePoints.length) {
						const fontIndex = selectedFontIndices[spanStart];
						let spanEnd = spanStart + 1;
						if (fontIndex !== -1) while (spanEnd < codePoints.length && selectedFontIndices[spanEnd] === fontIndex) spanEnd += 1;
						fallbackSpans.push({
							start: spanStart,
							end: spanEnd,
							fontIndex
						});
						if (fallbackSpans.length > CanvasKitLayerRenderer.MAX_TEXT_RUN_FALLBACK_SPANS) {
							this.unsupportedOps.add("textRun:fallbackSpanLimitExceeded");
							return;
						}
						spanStart = spanEnd;
					}
				}
				const drawPass = (fillPaint, offsetX = 0, offsetY = 0, strokePaint) => {
					if (verticalPresentationText !== void 0) {
						const selectedFont = hasLayoutPositions ? candidateFonts[fallbackSpans[0]?.fontIndex ?? 0] ?? font : font;
						const glyphIds = selectedFont.getGlyphIDs(verticalPresentationText, 1);
						const glyphBounds = selectedFont.getGlyphBounds?.(glyphIds) ?? /* @__PURE__ */ new Float32Array();
						const left = glyphBounds[0] ?? 0;
						const top = glyphBounds[1] ?? -fontSize;
						const right = glyphBounds[2] ?? fontSize;
						const bottom = glyphBounds[3] ?? 0;
						const advance = hasLayoutPositions ? replayPositions[1] - replayPositions[0] : op.bbox.width;
						const targetCenterX = originX + (Number.isFinite(advance) ? advance : op.bbox.width) / 2;
						const targetCenterY = originY - baseline + baselineShift + op.bbox.height / 2;
						canvas.save();
						try {
							canvas.translate(targetCenterX + offsetX, targetCenterY + offsetY);
							canvas.rotate(90, 0, 0);
							canvas.drawText(verticalPresentationText, -(left + right) / 2, -(top + bottom) / 2, fillPaint, selectedFont);
							if (strokePaint) canvas.drawText(verticalPresentationText, -(left + right) / 2, -(top + bottom) / 2, strokePaint, selectedFont);
						} finally {
							canvas.restore();
						}
						return;
					}
					if (!hasLayoutPositions) {
						const y = originY + baselineShift + offsetY;
						canvas.drawText(glyphReplayText, originX + offsetX, y, fillPaint, font);
						if (strokePaint) canvas.drawText(glyphReplayText, originX + offsetX, y, strokePaint, font);
						return;
					}
					let hasMissingGlyph = false;
					for (const { start: runStart, end: runEnd, fontIndex } of fallbackSpans) {
						if (fontIndex === -2) {
							if (!this.renderShapedScriptText(canvas, codePoints.slice(runStart, runEnd).join(""), style.color ?? "#000000", fontSize, originX + replayPositions[runStart] + offsetX, originY + offsetY, baselineShift, oldHangulTypeface?.fontManager ?? null, oldHangulTypeface?.fontFamily ?? OLD_HANGUL_FONT_FAMILY, style.bold === true, style.italic === true)) hasMissingGlyph = true;
							continue;
						}
						if (fontIndex === -1) {
							const codePoint = codePoints[runStart].codePointAt(0) ?? 0;
							const displayNumber = String(codePoint - 983728);
							const boxSize = Math.max(1, fontSize * .72);
							const boxX = originX + replayPositions[runStart];
							const boxY = originY + baselineShift - fontSize * .76;
							boxedPuaStrokePaint ??= this.makeStrokePaint(style.color ?? "#000000", Math.max(.6, fontSize * .04));
							boxedPuaFont ??= new this.canvasKit.Font(this.symbolFallbackTypeface ?? this.defaultTypeface ?? typeface, Math.max(1, fontSize * .5));
							adjustFont(boxedPuaFont);
							const numberGlyphIds = boxedPuaFont.getGlyphIDs(displayNumber, displayNumber.length);
							const numberWidth = (boxedPuaFont.getGlyphWidths(numberGlyphIds) ?? []).reduce((sum, width) => sum + width, 0);
							canvas.drawRect(this.canvasKit.XYWHRect(boxX + offsetX, boxY + offsetY, boxSize, boxSize), boxedPuaStrokePaint);
							canvas.drawText(displayNumber, boxX + (boxSize - numberWidth) / 2 + offsetX, boxY + boxSize * .72 + offsetY, fillPaint, boxedPuaFont);
							continue;
						}
						const runGlyphIds = new Uint16Array(runEnd - runStart);
						const runPositions = new Float32Array((runEnd - runStart) * 2);
						for (let index = runStart; index < runEnd; index += 1) {
							const glyphId = candidateGlyphIds[fontIndex][index] ?? 0;
							runGlyphIds[index - runStart] = glyphId;
							runPositions[(index - runStart) * 2] = replayPositions[index];
							runPositions[(index - runStart) * 2 + 1] = baselineShift;
							hasMissingGlyph ||= glyphId === 0;
						}
						canvas.drawGlyphs(runGlyphIds, runPositions, originX + offsetX, originY + offsetY, candidateFonts[fontIndex], fillPaint);
						if (strokePaint) canvas.drawGlyphs(runGlyphIds, runPositions, originX + offsetX, originY + offsetY, candidateFonts[fontIndex], strokePaint);
					}
					if (hasMissingGlyph) this.unsupportedOps.add("textRun:glyphMapping");
				};
				if (!hasLayoutPositions && needsPreservedAdvances) this.unsupportedOps.add("textRun:layoutPositions");
				const textWidth = hasLayoutPositions ? replayPositions.at(-1) ?? op.bbox.width : op.bbox.width;
				if (textWidth > 0 && shadeColor !== "#ffffff" && shadeColor !== "#000000") {
					const shadePaint = this.makeFillPaint(shadeColor);
					effectPaints.push(shadePaint);
					canvas.drawRect(this.canvasKit.XYWHRect(originX, originY + baselineShift - fontSize, textWidth, fontSize * 1.2), shadePaint);
				}
				if (style.emboss || style.engrave) {
					const offset = Math.max(fontSize / 20, 1);
					const firstPaint = this.makeFillPaint(style.emboss ? "#ffffff" : "#808080");
					effectPaints.push(firstPaint);
					const secondPaint = this.makeFillPaint(style.emboss ? "#808080" : "#ffffff");
					effectPaints.push(secondPaint);
					drawPass(firstPaint, -offset, -offset);
					drawPass(secondPaint, offset, offset);
					drawPass(paint);
				} else {
					if (shadowType > 0) {
						const shadowPaint = this.makeFillPaint(style.shadowColor ?? style.color ?? "#000000");
						effectPaints.push(shadowPaint);
						drawPass(shadowPaint, shadowOffsetX, shadowOffsetY);
					}
					if (outlineType > 0) {
						const outlineFillPaint = this.makeFillPaint("#ffffff");
						effectPaints.push(outlineFillPaint);
						const outlineStrokePaint = this.makeStrokePaint(style.color ?? "#000000", Math.max(fontSize / 25, .5));
						effectPaints.push(outlineStrokePaint);
						drawPass(outlineFillPaint, 0, 0, outlineStrokePaint);
					} else drawPass(paint);
				}
			}
		} finally {
			try {
				if (canvasSaved) canvas.restore();
			} finally {
				font?.delete?.();
				for (const fallbackFont of fallbackFonts) fallbackFont.delete?.();
				boxedPuaFont?.delete?.();
				boxedPuaStrokePaint?.delete?.();
				for (const effectPaint of effectPaints) effectPaint.delete?.();
				paint.delete?.();
			}
		}
		if (op.isVertical) this.currentReplayFeatureCounts.verticalTextRuns += 1;
		if (verticalPresentationText !== void 0) this.currentReplayFeatureCounts.verticalPresentationPunctuation += 1;
	}
	renderCharOverlap(canvas, op) {
		if (typeof op.text !== "string" || !op.charOverlap || !Array.isArray(op.positions)) {
			this.unsupportedOps.add("charOverlap:invalidGeometry");
			return;
		}
		if (op.positionsComplete !== true || op.positions.length > CanvasKitLayerRenderer.MAX_TEXT_SPECIAL_VISUAL_ITEMS + 1) {
			this.unsupportedOps.add("charOverlap:visualItemLimitExceeded");
			return;
		}
		const chars = [];
		for (const ch of op.text) {
			if (chars.length >= CanvasKitLayerRenderer.MAX_TEXT_SPECIAL_VISUAL_ITEMS) {
				this.unsupportedOps.add("charOverlap:visualItemLimitExceeded");
				return;
			}
			chars.push(ch);
		}
		if (op.positions.length !== chars.length + 1) {
			this.unsupportedOps.add("charOverlap:invalidGeometry");
			return;
		}
		if (chars.length === 0) return;
		if (op.isVertical) {
			this.unsupportedOps.add("textRun:verticalText");
			return;
		}
		const style = op.style ?? {};
		const rawFontSize = style.fontSize ?? (op.bbox.height || 12);
		if (![
			op.baseline,
			op.rotation,
			rawFontSize,
			op.charOverlap.innerCharSize
		].every(Number.isFinite) || op.positions.some((position) => !Number.isFinite(position)) || rawFontSize <= 0 || !Number.isInteger(op.charOverlap.borderType) || op.charOverlap.borderType < 0 || op.charOverlap.borderType > 4 || !Number.isInteger(op.charOverlap.innerCharSize) || op.charOverlap.innerCharSize < -128 || op.charOverlap.innerCharSize > 127) {
			this.unsupportedOps.add("charOverlap:invalidGeometry");
			return;
		}
		const fontSize = Math.max(1, rawFontSize);
		const rawRatio = op.charOverlap.innerCharSize > 0 ? op.charOverlap.innerCharSize / 100 : op.charOverlap.innerCharSize < 0 ? 1 + op.charOverlap.innerCharSize * .1 : 1;
		const innerFontSize = Math.max(1, fontSize * Math.min(4, Math.max(.1, rawRatio)));
		const requestedFontFamily = primaryFontFamily(style.fontFamily);
		const preparedTypeface = this.findPreparedTypeface(requestedFontFamily);
		if (requestedFontFamily && !preparedTypeface && this.requirePreparedFontFamilies) throw new Error(`CanvasKit font family가 준비되지 않았습니다: ${requestedFontFamily}`);
		const primaryTypeface = preparedTypeface?.typeface ?? this.defaultTypeface;
		const overlapDigits = [];
		for (const ch of chars) {
			const codePoint = ch.codePointAt(0) ?? 0;
			const digit = codePoint >= 983689 && codePoint <= 983697 ? [0, codePoint - 983688] : codePoint >= 983698 && codePoint <= 983707 ? [1, codePoint - 983698] : codePoint >= 984209 && codePoint <= 984217 ? [0, codePoint - 984208] : codePoint >= 984218 && codePoint <= 984227 ? [1, codePoint - 984218] : codePoint >= 984228 && codePoint <= 984237 ? [2, codePoint - 984228] : null;
			if (!digit) {
				overlapDigits.length = 0;
				break;
			}
			overlapDigits.push(digit);
		}
		const decodedNumber = overlapDigits.length === chars.length ? overlapDigits.sort(([left], [right]) => left - right).map(([, digit]) => String.fromCharCode(48 + digit)).join("") : null;
		const draw = (originX, originY) => {
			const boxSize = fontSize;
			const centerY = originY + op.bbox.height - boxSize / 2;
			const drawCell = (displayText, centerX, drawShape, horizontalScale) => {
				const borderType = horizontalScale !== void 0 && op.charOverlap.borderType === 0 ? 1 : op.charOverlap.borderType;
				const reversed = borderType === 2 || borderType === 4;
				const circle = borderType === 1 || borderType === 2;
				const rectangle = borderType === 3 || borderType === 4;
				const textColor = reversed ? "#ffffff" : style.color ?? "#000000";
				if (drawShape && (circle || rectangle)) {
					let fill = null;
					let stroke = null;
					try {
						fill = reversed ? this.makeFillPaint("#000000") : null;
						stroke = this.makeStrokePaint(reversed ? "#000000" : style.color ?? "#000000", .8);
						if (circle) {
							const radiusY = boxSize / 2;
							const radiusX = radiusY * .85;
							const oval = this.canvasKit.XYWHRect(centerX - radiusX, centerY - radiusY, radiusX * 2, radiusY * 2);
							if (fill) canvas.drawOval(oval, fill);
							canvas.drawOval(oval, stroke);
						} else {
							const rect = this.canvasKit.XYWHRect(centerX - boxSize / 2, centerY - boxSize / 2, boxSize, boxSize);
							if (fill) canvas.drawRect(rect, fill);
							canvas.drawRect(rect, stroke);
						}
					} finally {
						fill?.delete?.();
						stroke?.delete?.();
					}
				}
				let textFont = new this.canvasKit.Font(primaryTypeface, innerFontSize);
				let fallbackCandidate = null;
				let paint = null;
				const adjustFont = (target) => {
					const adjustable = target;
					adjustable.setEmbolden?.(style.bold === true);
					adjustable.setSkewX?.(style.italic === true ? -.2 : 0);
				};
				try {
					adjustFont(textFont);
					let glyphIds = textFont.getGlyphIDs(displayText, Array.from(displayText).length);
					if (glyphIds.some((glyphId) => glyphId === 0)) for (const fallbackTypeface of [this.defaultTypeface, this.symbolFallbackTypeface]) {
						if (!fallbackTypeface || fallbackTypeface === primaryTypeface) continue;
						fallbackCandidate = new this.canvasKit.Font(fallbackTypeface, innerFontSize);
						adjustFont(fallbackCandidate);
						const fallbackGlyphIds = fallbackCandidate.getGlyphIDs(displayText, Array.from(displayText).length);
						if (fallbackGlyphIds.every((glyphId) => glyphId !== 0)) {
							textFont.delete?.();
							textFont = fallbackCandidate;
							fallbackCandidate = null;
							glyphIds = fallbackGlyphIds;
							break;
						}
						fallbackCandidate.delete?.();
						fallbackCandidate = null;
					}
					if (glyphIds.some((glyphId) => glyphId === 0)) this.unsupportedOps.add("textRun:glyphMapping");
					const measuredWidth = (textFont.getGlyphWidths(glyphIds) ?? []).reduce((sum, width) => sum + width, 0);
					const scaleX = horizontalScale ?? 1;
					if (scaleX < 1) textFont.setScaleX(scaleX);
					const drawWidth = measuredWidth * scaleX;
					paint = this.makeFillPaint(textColor);
					const textY = (horizontalScale !== void 0 ? centerY - fontSize * .08 : centerY) + innerFontSize * .35;
					canvas.drawText(displayText, centerX - Math.max(drawWidth, 1) / 2, textY, paint, textFont);
				} finally {
					paint?.delete?.();
					fallbackCandidate?.delete?.();
					textFont.delete?.();
				}
			};
			if (decodedNumber !== null) {
				const horizontalScale = decodedNumber.length > 1 ? .7 / decodedNumber.length * 2 : 1;
				drawCell(decodedNumber, originX + boxSize / 2, true, horizontalScale);
				return;
			}
			const centerX = chars.length > 1 ? originX + op.bbox.width / 2 : originX + boxSize / 2;
			chars.forEach((ch, index) => {
				const codePoint = ch.codePointAt(0) ?? 0;
				const displayText = codePoint >= 9312 && codePoint <= 9331 ? String(codePoint - 9312 + 1) : codePoint >= 983758 && codePoint <= 983777 ? String(codePoint - 983757) : codePoint === 983339 ? "(인)" : codePoint === 983836 ? "■" : codePoint === 983804 ? "►" : codePoint === 984005 ? "□" : ch;
				drawCell(displayText, centerX, index === 0);
			});
		};
		this.withHorizontalTextVisualOrigin(canvas, op.bbox, op.rotation ?? 0, "charOverlap", draw);
	}
	renderTextControlMark(canvas, op) {
		if (op.isVertical) {
			this.unsupportedOps.add("textRun:verticalText");
			return;
		}
		if (!Array.isArray(op.marks)) {
			this.unsupportedOps.add("textControlMark:invalidGeometry");
			return;
		}
		if (op.marksComplete !== true || op.marks.length > CanvasKitLayerRenderer.MAX_TEXT_SPECIAL_VISUAL_ITEMS) {
			this.unsupportedOps.add("textControlMark:visualItemLimitExceeded");
			return;
		}
		if (![op.baseline, op.rotation].every(Number.isFinite) || op.marks.some((mark) => ![
			"space",
			"tab",
			"paragraphEnd",
			"lineBreakEnd"
		].includes(mark.kind) || ![
			mark.x,
			mark.y,
			mark.fontSize
		].every(Number.isFinite) || mark.fontSize <= 0)) {
			this.unsupportedOps.add("textControlMark:invalidGeometry");
			return;
		}
		if (!this.currentShowParagraphMarks && !this.currentShowControlCodes) return;
		const draw = (originX, originY) => {
			const baselineY = originY + op.baseline;
			let paint = null;
			try {
				paint = this.makeStrokePaint("#0066ff", .75);
				for (const mark of op.marks) {
					const x = originX + mark.x;
					const y = baselineY + mark.y;
					const size = mark.fontSize;
					if (mark.kind === "space") {
						canvas.drawLine(x, y - size * .45, x + size * .25, y - size * .15, paint);
						canvas.drawLine(x + size * .25, y - size * .15, x + size * .5, y - size * .45, paint);
					} else if (mark.kind === "tab") {
						const lineY = y - size * .3;
						const tipX = x + size * .85;
						canvas.drawLine(x, lineY, tipX, lineY, paint);
						canvas.drawLine(tipX, lineY, tipX - size * .25, lineY - size * .2, paint);
						canvas.drawLine(tipX, lineY, tipX - size * .25, lineY + size * .2, paint);
					} else if (mark.kind === "paragraphEnd") {
						const topY = y - size * .8;
						const turnX = x + size * .4;
						const arrowY = y - size * .25;
						canvas.drawLine(turnX, topY, turnX, arrowY, paint);
						canvas.drawLine(turnX, arrowY, x, arrowY, paint);
						canvas.drawLine(x, arrowY, x + size * .2, arrowY - size * .18, paint);
						canvas.drawLine(x, arrowY, x + size * .2, arrowY + size * .18, paint);
					} else {
						const lineX = x + size * .25;
						const tipY = y - size * .1;
						canvas.drawLine(lineX, y - size * .85, lineX, tipY, paint);
						canvas.drawLine(lineX, tipY, lineX - size * .18, tipY - size * .22, paint);
						canvas.drawLine(lineX, tipY, lineX + size * .18, tipY - size * .22, paint);
					}
				}
			} finally {
				paint?.delete?.();
			}
		};
		this.withHorizontalTextVisualOrigin(canvas, op.bbox, op.rotation, "textControlMark", draw);
	}
	renderTabLeader(canvas, op) {
		if (op.isVertical) {
			this.unsupportedOps.add("textRun:verticalText");
			return;
		}
		if (!Array.isArray(op.leaders)) {
			this.unsupportedOps.add("tabLeader:invalidGeometry");
			return;
		}
		if (op.leadersComplete !== true || op.leaders.length > CanvasKitLayerRenderer.MAX_TEXT_SPECIAL_VISUAL_ITEMS) {
			this.unsupportedOps.add("tabLeader:visualItemLimitExceeded");
			return;
		}
		if (![
			op.baseline,
			op.fontSize,
			op.rotation
		].every(Number.isFinite) || op.fontSize <= 0 || op.leaders.some((leader) => ![leader.startX, leader.endX].every(Number.isFinite) || leader.endX < leader.startX || !Number.isInteger(leader.fillType) || leader.fillType < 0 || leader.fillType > 11)) {
			this.unsupportedOps.add("tabLeader:invalidGeometry");
			return;
		}
		const draw = (originX, originY) => {
			const baselineY = originY + op.baseline;
			for (const leader of op.leaders) {
				if (leader.fillType === 0 || leader.endX <= leader.startX) continue;
				const x1 = originX + leader.startX;
				const x2 = originX + leader.endX;
				const y = baselineY - op.fontSize * .35;
				switch (leader.fillType) {
					case 1:
						this.drawTextVisualStroke(canvas, x1, y, x2, y, op.color, .5);
						break;
					case 2:
						this.drawTextVisualStroke(canvas, x1, y, x2, y, op.color, .5, [3, 3]);
						break;
					case 3:
						this.drawTextVisualStroke(canvas, x1, y, x2, y, op.color, 1, [.1, 3], true);
						break;
					case 4:
						this.drawTextVisualStroke(canvas, x1, y, x2, y, op.color, .5, [
							6,
							2,
							1,
							2
						]);
						break;
					case 5:
						this.drawTextVisualStroke(canvas, x1, y, x2, y, op.color, .5, [
							6,
							2,
							1,
							2,
							1,
							2
						]);
						break;
					case 6:
						this.drawTextVisualStroke(canvas, x1, y, x2, y, op.color, .5, [8, 4]);
						break;
					case 7:
						this.drawTextVisualStroke(canvas, x1, y, x2, y, op.color, .7, [.1, 2.5], true);
						break;
					case 8:
						this.drawTextVisualStroke(canvas, x1, y - 1, x2, y - 1, op.color, .3);
						this.drawTextVisualStroke(canvas, x1, y + 1, x2, y + 1, op.color, .3);
						break;
					case 9:
						this.drawTextVisualStroke(canvas, x1, y - 1.2, x2, y - 1.2, op.color, .3);
						this.drawTextVisualStroke(canvas, x1, y + .8, x2, y + .8, op.color, .8);
						break;
					case 10:
						this.drawTextVisualStroke(canvas, x1, y - .8, x2, y - .8, op.color, .8);
						this.drawTextVisualStroke(canvas, x1, y + 1.2, x2, y + 1.2, op.color, .3);
						break;
					case 11:
						this.drawTextVisualStroke(canvas, x1, y - 2, x2, y - 2, op.color, .3);
						this.drawTextVisualStroke(canvas, x1, y, x2, y, op.color, .8);
						this.drawTextVisualStroke(canvas, x1, y + 2, x2, y + 2, op.color, .3);
				}
			}
		};
		this.withHorizontalTextVisualOrigin(canvas, op.bbox, op.rotation, "tabLeader", draw);
	}
	renderTextDecoration(canvas, op) {
		const decoration = op.decoration;
		if (!decoration || !Array.isArray(decoration.positions) || ![
			"underline",
			"strikethrough",
			"emphasisDot"
		].includes(decoration.kind)) {
			this.unsupportedOps.add("textDecoration:invalidGeometry");
			return;
		}
		if (decoration.isVertical) {
			this.unsupportedOps.add("textRun:verticalText");
			return;
		}
		if (decoration.positionsComplete !== true || decoration.positions.length > CanvasKitLayerRenderer.MAX_TEXT_SPECIAL_VISUAL_ITEMS + 1) {
			this.unsupportedOps.add("textDecoration:visualItemLimitExceeded");
			return;
		}
		if (![
			decoration.baseline,
			decoration.rotation,
			decoration.fontSize,
			decoration.ratio
		].every(Number.isFinite) || decoration.fontSize <= 0 || decoration.ratio <= 0 || decoration.positions.some((position) => !Number.isFinite(position)) || !Number.isInteger(decoration.shape) || decoration.shape < 0 || decoration.shape > 12 || !Number.isInteger(decoration.emphasisDot) || decoration.emphasisDot < 0 || decoration.emphasisDot > 6 || ![
			"none",
			"bottom",
			"top"
		].includes(decoration.underline)) {
			this.unsupportedOps.add("textDecoration:invalidGeometry");
			return;
		}
		const textWidth = decoration.positions.at(-1) ?? 0;
		if (!Number.isFinite(textWidth) || textWidth < 0) {
			this.unsupportedOps.add("textDecoration:invalidGeometry");
			return;
		}
		const drawLineShape = (originX, y) => {
			const x2 = originX + textWidth;
			switch (decoration.shape) {
				case 7:
					this.drawTextVisualStroke(canvas, originX, y - 1, x2, y - 1, decoration.color, .7);
					this.drawTextVisualStroke(canvas, originX, y + 1, x2, y + 1, decoration.color, .7);
					break;
				case 8:
					this.drawTextVisualStroke(canvas, originX, y - 1.2, x2, y - 1.2, decoration.color, .5);
					this.drawTextVisualStroke(canvas, originX, y + .8, x2, y + .8, decoration.color, 1.2);
					break;
				case 9:
					this.drawTextVisualStroke(canvas, originX, y - .8, x2, y - .8, decoration.color, 1.2);
					this.drawTextVisualStroke(canvas, originX, y + 1.2, x2, y + 1.2, decoration.color, .5);
					break;
				case 10:
					this.drawTextVisualStroke(canvas, originX, y - 1.5, x2, y - 1.5, decoration.color, .5);
					this.drawTextVisualStroke(canvas, originX, y, x2, y, decoration.color, .5);
					this.drawTextVisualStroke(canvas, originX, y + 1.5, x2, y + 1.5, decoration.color, .5);
					break;
				case 11:
					this.drawTextVisualStroke(canvas, originX, y, x2, y, decoration.color, .7, [], false, 1.5, 6);
					break;
				case 12:
					this.drawTextVisualStroke(canvas, originX, y - 1, x2, y - 1, decoration.color, .5, [], false, 1.2, 6);
					this.drawTextVisualStroke(canvas, originX, y + 1, x2, y + 1, decoration.color, .5, [], false, 1.2, 6);
					break;
				default: {
					const dash = decoration.shape === 1 ? [3, 3] : decoration.shape === 2 ? [1, 2] : decoration.shape === 3 ? [
						6,
						2,
						1,
						2
					] : decoration.shape === 4 ? [
						6,
						2,
						1,
						2,
						1,
						2
					] : decoration.shape === 5 ? [8, 4] : decoration.shape === 6 ? [.1, 2.5] : [];
					this.drawTextVisualStroke(canvas, originX, y, x2, y, decoration.color, 1, dash, decoration.shape === 6);
				}
			}
		};
		const draw = (originX, originY) => {
			const baselineY = originY + decoration.baseline;
			if (decoration.kind === "underline") {
				const y = decoration.underline === "top" ? baselineY - decoration.fontSize + 1 : baselineY + 2;
				drawLineShape(originX, y);
				return;
			}
			if (decoration.kind === "strikethrough") {
				drawLineShape(originX, baselineY - decoration.fontSize * .3);
				return;
			}
			if (decoration.emphasisDot === 0) return;
			const dotSize = Math.max(1, decoration.fontSize * .3);
			let fillPaint = null;
			let strokePaint = null;
			try {
				fillPaint = this.makeFillPaint(decoration.color);
				strokePaint = this.makeStrokePaint(decoration.color, Math.max(dotSize * .12, .75));
				for (const position of decoration.positions.slice(0, -1)) {
					const x = originX + position + decoration.fontSize * decoration.ratio * .5;
					const centerY = baselineY - decoration.fontSize * 1.05 - dotSize * .45;
					if (decoration.emphasisDot === 1) canvas.drawCircle(x, centerY, Math.max(dotSize * .48, 1), fillPaint);
					else if (decoration.emphasisDot === 2) canvas.drawCircle(x, centerY, Math.max(dotSize * .48, 1), strokePaint);
					else if (decoration.emphasisDot === 3) {
						canvas.drawLine(x - dotSize * .45, centerY - dotSize * .2, x, centerY + dotSize * .25, strokePaint);
						canvas.drawLine(x, centerY + dotSize * .25, x + dotSize * .45, centerY - dotSize * .2, strokePaint);
					} else if (decoration.emphasisDot === 4) {
						canvas.drawLine(x - dotSize * .5, centerY, x - dotSize * .15, centerY - dotSize * .22, strokePaint);
						canvas.drawLine(x - dotSize * .15, centerY - dotSize * .22, x + dotSize * .15, centerY + dotSize * .22, strokePaint);
						canvas.drawLine(x + dotSize * .15, centerY + dotSize * .22, x + dotSize * .5, centerY, strokePaint);
					} else if (decoration.emphasisDot === 5) canvas.drawCircle(x, centerY, Math.max(dotSize * .22, .75), fillPaint);
					else {
						const radius = Math.max(dotSize * .18, .7);
						canvas.drawCircle(x, centerY - radius * 1.5, radius, fillPaint);
						canvas.drawCircle(x, centerY + radius * 1.5, radius, fillPaint);
					}
				}
			} finally {
				strokePaint?.delete?.();
				fillPaint?.delete?.();
			}
		};
		this.withHorizontalTextVisualOrigin(canvas, op.bbox, decoration.rotation, "textDecoration", draw);
	}
	withHorizontalTextVisualOrigin(canvas, bbox, rotation, opType, draw) {
		if (![
			bbox.x,
			bbox.y,
			bbox.width,
			bbox.height,
			rotation
		].every(Number.isFinite) || bbox.width < 0 || bbox.height < 0) {
			this.unsupportedOps.add(`${opType}:invalidGeometry`);
			return;
		}
		if (rotation !== 0) {
			this.unsupportedOps.add(`${opType}:rotatedText`);
			return;
		}
		draw(bbox.x, bbox.y);
	}
	drawTextVisualStroke(canvas, x1, y1, x2, y2, color, width, dash = [], roundCap = false, waveHeight = 0, waveWidth = 0) {
		const paint = this.makeStrokePaint(color, width);
		let effect = null;
		let path = null;
		try {
			if (roundCap) paint.setStrokeCap(this.canvasKit.StrokeCap.Round);
			if (dash.length > 0) {
				effect = this.canvasKit.PathEffect.MakeDash(dash, 0);
				if (effect) paint.setPathEffect(effect);
			}
			if (waveHeight > 0 && waveWidth > 0) {
				const builder = new this.canvasKit.PathBuilder();
				try {
					builder.moveTo(x1, y1);
					let cursor = x1;
					let up = true;
					const step = Math.max(waveWidth, (x2 - x1) / CanvasKitLayerRenderer.MAX_TEXT_VISUAL_WAVE_SEGMENTS);
					while (cursor < x2) {
						const next = Math.min(cursor + step, x2);
						builder.quadTo((cursor + next) / 2, up ? y1 - waveHeight : y1 + waveHeight, next, y1);
						cursor = next;
						up = !up;
					}
					path = builder.detach();
				} finally {
					builder.delete?.();
				}
				canvas.drawPath(path, paint);
			} else canvas.drawLine(x1, y1, x2, y2, paint);
		} finally {
			path?.delete?.();
			effect?.delete?.();
			paint.delete?.();
		}
	}
	renderShapedScriptText(canvas, text, color, fontSize, originX, originY, baselineShift, fontManager, fontFamily, bold, italic) {
		if (!fontManager) return false;
		const textStyle = {
			color: this.color(color),
			fontSize,
			...fontFamily ? { fontFamilies: [fontFamily] } : {},
			...this.canvasKit.FontWeight && this.canvasKit.FontSlant ? { fontStyle: {
				weight: bold ? this.canvasKit.FontWeight.Bold : this.canvasKit.FontWeight.Normal,
				slant: italic ? this.canvasKit.FontSlant.Italic : this.canvasKit.FontSlant.Upright
			} } : {}
		};
		const paragraphStyle = new this.canvasKit.ParagraphStyle({
			maxLines: 1,
			textStyle
		});
		const builder = this.canvasKit.ParagraphBuilder.Make(paragraphStyle, fontManager);
		try {
			builder.addText(text);
			const paragraph = builder.build();
			try {
				paragraph.layout(CanvasKitLayerRenderer.MAX_SHAPED_TEXT_WIDTH);
				canvas.drawParagraph(paragraph, originX, originY - fontSize + baselineShift);
				return true;
			} finally {
				paragraph.delete?.();
			}
		} finally {
			builder.delete?.();
		}
	}
	findPreparedTypeface(fontFamily) {
		const key = normalizedFontFamily(fontFamily);
		if (!key) return null;
		const record = resolveLocalFont(primaryFontFamily(fontFamily));
		const local = record ? this.localTypefaces.get(localFontFaceKey(record)) ?? null : null;
		const bundled = this.bundledTypefaceAliases.get(key);
		if (key === normalizedFontFamily(OLD_HANGUL_FONT_FAMILY)) return [
			this.oldHangulTypeface,
			local,
			bundled
		].find((candidate) => candidate?.fontManager) ?? null;
		if (local) return local;
		if (bundled) return bundled;
		if (key === normalizedFontFamily(this.defaultFontFamily) || key === "noto sans kr") return this.defaultTypeface || this.defaultFontManager ? {
			typeface: this.defaultTypeface,
			fontManager: this.defaultFontManager,
			fontFamily: this.defaultFontFamily
		} : null;
		return null;
	}
	recordFontSubstitution(diagnostic) {
		const key = JSON.stringify([
			diagnostic.requestedFamily,
			diagnostic.resolvedFamily,
			diagnostic.source
		]);
		if (this.currentFontSubstitutions.has(key) || this.currentFontSubstitutions.size < CanvasKitLayerRenderer.MAX_FONT_SUBSTITUTION_DIAGNOSTICS) this.currentFontSubstitutions.set(key, diagnostic);
	}
	renderEquation(canvas, op) {
		if (!op.layoutBox || !this.boundsAreDrawable(op.bbox)) {
			this.unsupportedOps.add("equation:unsupportedDirectReplay");
			return;
		}
		const scaleX = op.layoutBox.width > 0 && op.bbox.width > 0 ? op.bbox.width / op.layoutBox.width : 1;
		const budget = { remainingNodes: CanvasKitLayerRenderer.MAX_EQUATION_LAYOUT_NODES };
		const recorder = new this.canvasKit.PictureRecorder();
		let picture = null;
		let recordingFinished = false;
		let replayed = false;
		try {
			const recordingCanvas = recorder.beginRecording(this.rect(op.bbox));
			recordingCanvas.save();
			recordingCanvas.translate(op.bbox.x, op.bbox.y);
			if (Math.abs(scaleX - 1) > .01) recordingCanvas.scale(scaleX, 1);
			try {
				replayed = this.renderEquationBox(recordingCanvas, op.layoutBox, 0, 0, op.color ?? "#000000", Math.max(1, op.fontSize ?? op.bbox.height), false, false, 0, budget);
			} finally {
				recordingCanvas.restore();
			}
			picture = recorder.finishRecordingAsPicture();
			recordingFinished = true;
			if (replayed) canvas.drawPicture(picture);
		} catch {
			replayed = false;
		} finally {
			if (!recordingFinished) try {
				picture = recorder.finishRecordingAsPicture();
			} catch {
				picture = null;
			}
			picture?.delete?.();
			recorder.delete?.();
		}
		if (!replayed) this.unsupportedOps.add("equation:invalidLayout");
	}
	renderEquationBox(canvas, layout, parentX, parentY, color, fontSize, italic, bold, depth, budget) {
		if (depth > CanvasKitLayerRenderer.MAX_EQUATION_LAYOUT_DEPTH || budget.remainingNodes <= 0 || !this.equationBoxIsFinite(layout)) return false;
		budget.remainingNodes -= 1;
		const x = parentX + layout.x;
		const y = parentY + layout.y;
		const child = (box, size = fontSize, childItalic = italic, childBold = bold) => this.renderEquationBox(canvas, box, x, y, color, size, childItalic, childBold, depth + 1, budget);
		switch (layout.kind.type) {
			case "row": return layout.kind.children.every((box) => child(box));
			case "text":
			case "number":
			case "symbol":
			case "mathSymbol": return this.drawEquationText(canvas, layout.kind.text, x, y + layout.baseline, this.equationFontSizeFromBox(layout, fontSize), color, layout.kind.type === "text" || italic, bold, layout.width, layout.kind.type === "symbol");
			case "function": return this.drawEquationText(canvas, layout.kind.name, x, y + layout.baseline, this.equationFontSizeFromBox(layout, fontSize), color, italic, bold, layout.width, false);
			case "fraction": return child(layout.kind.numer) && this.drawEquationLine(canvas, x + fontSize * .05, y + layout.baseline, x + layout.width - fontSize * .05, y + layout.baseline, color, fontSize * .04) && child(layout.kind.denom);
			case "atop": return child(layout.kind.top) && child(layout.kind.bottom);
			case "sqrt": {
				const bodyLeft = x + layout.kind.body.x - fontSize * .1;
				const midX = bodyLeft - fontSize * .15;
				const midY = y + layout.height;
				const startX = midX - fontSize * .3;
				const startY = y + layout.height * .6;
				const tickX = startX - fontSize * .1;
				const tickY = startY - fontSize * .05;
				const linesDrawn = this.drawEquationLine(canvas, tickX, tickY, startX, startY, color, fontSize * .04) && this.drawEquationLine(canvas, startX, startY, midX, midY, color, fontSize * .04) && this.drawEquationLine(canvas, midX, midY, bodyLeft, y, color, fontSize * .04) && this.drawEquationLine(canvas, bodyLeft, y, x + layout.width, y, color, fontSize * .04);
				const indexDrawn = layout.kind.index ? child(layout.kind.index, fontSize * .7, false, false) : true;
				return linesDrawn && indexDrawn && child(layout.kind.body);
			}
			case "superscript": return child(layout.kind.base) && child(layout.kind.sup, fontSize * .7);
			case "subscript": return child(layout.kind.base) && child(layout.kind.sub, fontSize * .7);
			case "subSup": return child(layout.kind.base) && child(layout.kind.sub, fontSize * .7) && child(layout.kind.sup, fontSize * .7);
			case "bigOp": {
				const opSize = fontSize * 1.5;
				const supHeight = layout.kind.sup ? layout.kind.sup.height + fontSize * .05 : 0;
				const symbolDrawn = this.drawEquationText(canvas, layout.kind.symbol, x, y + supHeight + opSize * .8, opSize, color, false, false, layout.width, true);
				const supDrawn = layout.kind.sup ? child(layout.kind.sup, fontSize * .7, false, false) : true;
				const subDrawn = layout.kind.sub ? child(layout.kind.sub, fontSize * .7, false, false) : true;
				return symbolDrawn && supDrawn && subDrawn;
			}
			case "limit": {
				const size = this.equationFontSizeFromBox(layout, fontSize);
				return this.drawEquationText(canvas, layout.kind.isUpper ? "Lim" : "lim", x, y + size * .8, size, color, false, false, layout.width, false) && (layout.kind.sub ? child(layout.kind.sub, fontSize * .7, false, false) : true);
			}
			case "matrix": {
				let rendered = true;
				if (layout.kind.style !== "plain") {
					const brackets = layout.kind.style === "paren" ? ["(", ")"] : layout.kind.style === "bracket" ? ["[", "]"] : ["|", "|"];
					rendered = this.drawEquationBracket(canvas, brackets[0], x, y, layout.height, color, fontSize) && this.drawEquationBracket(canvas, brackets[1], x + layout.width, y, layout.height, color, fontSize);
				}
				for (const row of layout.kind.cells) for (const cell of row) rendered = child(cell) && rendered;
				return rendered;
			}
			case "rel": return child(layout.kind.over) && child(layout.kind.arrow) && (layout.kind.under ? child(layout.kind.under) : true);
			case "eqAlign": return layout.kind.rows.every((row) => child(row.left) && child(row.right));
			case "paren": return (layout.kind.left ? this.drawEquationBracket(canvas, layout.kind.left, x, y, layout.height, color, fontSize) : true) && child(layout.kind.body) && (layout.kind.right ? this.drawEquationBracket(canvas, layout.kind.right, x + layout.width, y, layout.height, color, fontSize) : true);
			case "decoration": return child(layout.kind.body) && this.drawEquationDecoration(canvas, layout.kind.decoration, x + layout.kind.body.x + layout.kind.body.width / 2, y + fontSize * .05, layout.kind.body.width, color, fontSize);
			case "fontStyle": {
				if (![
					"roman",
					"italic",
					"bold"
				].includes(layout.kind.fontStyle)) return false;
				const nextItalic = layout.kind.fontStyle === "roman" ? false : layout.kind.fontStyle === "italic" || layout.kind.fontStyle === "calligraphy" || layout.kind.fontStyle === "fraktur" || italic;
				const nextBold = layout.kind.fontStyle === "roman" ? false : layout.kind.fontStyle === "bold" || layout.kind.fontStyle === "blackboard" || bold;
				return child(layout.kind.body, fontSize, nextItalic, nextBold);
			}
			case "space":
			case "newline":
			case "empty": return true;
		}
	}
	equationBoxIsFinite(layout) {
		return Number.isFinite(layout.x) && Number.isFinite(layout.y) && Number.isFinite(layout.width) && Number.isFinite(layout.height) && Number.isFinite(layout.baseline) && layout.width >= 0 && layout.height >= 0;
	}
	equationFontSizeFromBox(layout, baseFontSize) {
		return Math.max(1, layout.height > 0 ? layout.height : baseFontSize);
	}
	drawEquationText(canvas, text, x, baselineY, fontSize, color, italic, bold, targetWidth, centered) {
		if (!text || text.length > CanvasKitLayerRenderer.MAX_EQUATION_TEXT_LENGTH || ![
			x,
			baselineY,
			fontSize,
			targetWidth
		].every(Number.isFinite)) return false;
		let font = null;
		let paint = null;
		try {
			font = new this.canvasKit.Font(this.defaultTypeface, Math.max(1, fontSize));
			paint = this.makeFillPaint(color);
			const glyphIds = font.getGlyphIDs(text, Array.from(text).length);
			if (!glyphIds || glyphIds.some((glyphId) => glyphId === 0)) return false;
			const measuredWidth = (font.getGlyphWidths(glyphIds) ?? []).reduce((sum, width) => sum + width, 0);
			const drawWidth = targetWidth > 0 && measuredWidth > 0 ? targetWidth : measuredWidth;
			if (targetWidth > 0 && measuredWidth > 0) font.setScaleX(targetWidth / measuredWidth);
			const adjustableFont = font;
			adjustableFont.setEmbolden?.(bold);
			adjustableFont.setSkewX?.(italic ? -.2 : 0);
			canvas.drawText(text, centered ? x + (targetWidth - drawWidth) / 2 : x, baselineY, paint, font);
			return true;
		} finally {
			font?.delete?.();
			paint?.delete?.();
		}
	}
	drawEquationLine(canvas, x1, y1, x2, y2, color, width) {
		if (![
			x1,
			y1,
			x2,
			y2,
			width
		].every(Number.isFinite)) return false;
		const paint = this.makeStrokePaint(color, Math.max(.5, width));
		try {
			canvas.drawLine(x1, y1, x2, y2, paint);
			return true;
		} finally {
			paint.delete?.();
		}
	}
	drawEquationBracket(canvas, bracket, x, y, height, color, fontSize) {
		const width = Math.max(fontSize * .3, 1);
		if (bracket === "|") return this.drawEquationLine(canvas, x, y, x, y + height, color, fontSize * .04);
		return this.drawEquationText(canvas, bracket, x - width / 2, y + height * .7, Math.max(height, fontSize), color, false, false, width, true);
	}
	drawEquationDecoration(canvas, decoration, centerX, y, width, color, fontSize) {
		const halfWidth = width / 2;
		const strokeWidth = Math.max(fontSize * .03, .5);
		switch (decoration) {
			case "hat": return this.drawEquationLine(canvas, centerX - halfWidth * .6, y + fontSize * .15, centerX, y, color, strokeWidth) && this.drawEquationLine(canvas, centerX, y, centerX + halfWidth * .6, y + fontSize * .15, color, strokeWidth);
			case "bar":
			case "overline":
			case "strikeThrough": return this.drawEquationLine(canvas, centerX - halfWidth, y + fontSize * .05, centerX + halfWidth, y + fontSize * .05, color, strokeWidth);
			case "underline":
			case "under": return this.drawEquationLine(canvas, centerX - halfWidth, y + fontSize * 1.1, centerX + halfWidth, y + fontSize * 1.1, color, strokeWidth);
			case "vec":
			case "dyad": {
				const lineY = y + fontSize * .05;
				const endX = centerX + halfWidth;
				return this.drawEquationLine(canvas, centerX - halfWidth, lineY, endX, lineY, color, strokeWidth) && this.drawEquationLine(canvas, endX - fontSize * .1, lineY - fontSize * .06, endX, lineY, color, strokeWidth) && this.drawEquationLine(canvas, endX, lineY, endX - fontSize * .1, lineY + fontSize * .06, color, strokeWidth);
			}
			case "dot":
			case "dDot": {
				const paint = this.makeFillPaint(color);
				const radius = Math.max(fontSize * .03, 1);
				try {
					if (decoration === "dot") canvas.drawCircle(centerX, y + fontSize * .06, radius, paint);
					else {
						canvas.drawCircle(centerX - fontSize * .1, y + fontSize * .06, radius, paint);
						canvas.drawCircle(centerX + fontSize * .1, y + fontSize * .06, radius, paint);
					}
					return true;
				} finally {
					paint.delete?.();
				}
			}
			default: return false;
		}
	}
	renderFormObject(canvas, op) {
		const fill = op.backColor && op.backColor !== "#000000" ? op.backColor : "#f7f7f7";
		this.drawStyledShape(canvas, op.bbox, {
			fillColor: fill,
			strokeColor: op.foreColor ?? "#555555",
			strokeWidth: 1,
			opacity: op.enabled === false ? .55 : 1
		}, (paint) => canvas.drawRect(this.rect(op.bbox), paint));
		if (op.value && (op.formType === "checkBox" || op.formType === "radioButton" || op.formType === "checkbox" || op.formType === "radio")) {
			const paint = this.makeStrokePaint(op.foreColor ?? "#111111", 1.5);
			const b = op.bbox;
			canvas.drawLine(b.x + b.width * .25, b.y + b.height * .55, b.x + b.width * .45, b.y + b.height * .75, paint);
			canvas.drawLine(b.x + b.width * .45, b.y + b.height * .75, b.x + b.width * .78, b.y + b.height * .28, paint);
			paint.delete?.();
		}
		const label = op.caption || op.text;
		if (label) this.renderTextRun(canvas, {
			type: "textRun",
			bbox: {
				...op.bbox,
				x: op.bbox.x + 4,
				width: Math.max(0, op.bbox.width - 8)
			},
			text: label,
			baseline: Math.max(10, op.bbox.height * .68),
			style: {
				fontSize: Math.max(9, Math.min(14, op.bbox.height * .55)),
				color: op.foreColor ?? "#111111"
			}
		});
	}
	renderPlaceholder(canvas, op, profile) {
		if (op.kind === "missingPicture") {
			if (profile === "print" || profile === "highQuality") return;
			if (![
				op.bbox.x,
				op.bbox.y,
				op.bbox.width,
				op.bbox.height
			].every(Number.isFinite) || op.bbox.width <= 0 || op.bbox.height <= 0) return;
			const paint = this.makeStrokePaint(op.strokeColor ?? "#999999", 1);
			const dash = 5;
			const horizontalStep = Math.max(8, op.bbox.width / CanvasKitLayerRenderer.MAX_PLACEHOLDER_DASH_SEGMENTS_PER_AXIS);
			const verticalStep = Math.max(8, op.bbox.height / CanvasKitLayerRenderer.MAX_PLACEHOLDER_DASH_SEGMENTS_PER_AXIS);
			try {
				for (let x = op.bbox.x; x < op.bbox.x + op.bbox.width; x += horizontalStep) {
					const end = Math.min(x + horizontalStep * dash / 8, op.bbox.x + op.bbox.width);
					canvas.drawLine(x, op.bbox.y, end, op.bbox.y, paint);
					canvas.drawLine(x, op.bbox.y + op.bbox.height, end, op.bbox.y + op.bbox.height, paint);
				}
				for (let y = op.bbox.y; y < op.bbox.y + op.bbox.height; y += verticalStep) {
					const end = Math.min(y + verticalStep * dash / 8, op.bbox.y + op.bbox.height);
					canvas.drawLine(op.bbox.x, y, op.bbox.x, end, paint);
					canvas.drawLine(op.bbox.x + op.bbox.width, y, op.bbox.x + op.bbox.width, end, paint);
				}
			} finally {
				paint.delete?.();
			}
			const icon = Math.max(14, Math.min(36, Math.min(op.bbox.width, op.bbox.height) * .4));
			const ix = op.bbox.x + (op.bbox.width - icon) / 2;
			const iy = op.bbox.y + (op.bbox.height - icon * .75) / 2;
			const iconBounds = this.canvasKit.XYWHRect(ix, iy, icon, icon * .75);
			let iconFill = null;
			let iconStroke = null;
			let missingStroke = null;
			try {
				iconFill = this.makeFillPaint("#ffffff");
				iconStroke = this.makeStrokePaint("#888888", 1);
				missingStroke = this.makeStrokePaint("#cc4444", 1.5);
				canvas.drawRect(iconBounds, iconFill);
				canvas.drawRect(iconBounds, iconStroke);
				canvas.drawLine(ix + icon * .08, iy + icon * .62, ix + icon * .32, iy + icon * .3, iconStroke);
				canvas.drawLine(ix + icon * .32, iy + icon * .3, ix + icon * .52, iy + icon * .62, iconStroke);
				canvas.drawLine(ix + icon * .52, iy + icon * .62, ix + icon * .68, iy + icon * .42, iconStroke);
				canvas.drawLine(ix + icon * .68, iy + icon * .42, ix + icon * .92, iy + icon * .62, iconStroke);
				canvas.drawCircle(ix + icon * .72, iy + icon * .2, icon * .07, iconStroke);
				canvas.drawLine(ix, iy + icon * .75, ix + icon, iy, missingStroke);
			} finally {
				missingStroke?.delete?.();
				iconStroke?.delete?.();
				iconFill?.delete?.();
			}
			return;
		}
		this.drawStyledShape(canvas, op.bbox, {
			fillColor: op.fillColor ?? "#f2f2f2",
			strokeColor: op.strokeColor ?? "#999999",
			strokeWidth: 1
		}, (paint) => canvas.drawRect(this.rect(op.bbox), paint));
		if (op.label) this.renderTextRun(canvas, {
			type: "textRun",
			bbox: {
				...op.bbox,
				x: op.bbox.x + 4
			},
			text: op.label,
			baseline: Math.max(10, op.bbox.height * .65),
			style: {
				fontSize: Math.max(9, Math.min(14, op.bbox.height * .45)),
				color: "#555555"
			}
		});
	}
	drawStyledShape(canvas, bounds, style, draw) {
		if (style?.fillColor) {
			const paint = this.makeFillPaint(style.fillColor, style.opacity);
			draw(paint);
			paint.delete?.();
		}
		if (style?.strokeColor && (style.strokeWidth ?? 0) > 0) {
			const paint = this.makeStrokePaint(style.strokeColor, style.strokeWidth ?? 1, style.opacity);
			try {
				this.drawStrokeWithDash(style.strokeDash, paint, () => draw(paint));
			} finally {
				paint.delete?.();
			}
		}
		if (!style?.fillColor && !style?.strokeColor) {
			const paint = this.makeStrokePaint("#000000", 1);
			draw(paint);
			paint.delete?.();
		}
	}
	drawStyledPath(canvas, path, style) {
		let drawn = false;
		if (style.fillColor) {
			const paint = this.makeFillPaint(style.fillColor, style.opacity);
			canvas.drawPath(path, paint);
			paint.delete?.();
			drawn = true;
		}
		if (style.strokeColor && (style.strokeWidth ?? 0) > 0) {
			const paint = this.makeStrokePaint(style.strokeColor, style.strokeWidth ?? 1, style.opacity);
			try {
				this.drawStrokeWithDash(style.strokeDash, paint, () => canvas.drawPath(path, paint));
			} finally {
				paint.delete?.();
			}
			drawn = true;
		}
		if (!drawn) {
			const paint = this.makeStrokePaint("#000000", 1);
			canvas.drawPath(path, paint);
			paint.delete?.();
		}
	}
	drawStrokeWithDash(dash, paint, draw) {
		const intervals = dash === void 0 || dash === "solid" ? null : dash === "dash" ? [6, 3] : dash === "dot" ? [2, 2] : dash === "dashDot" ? [
			6,
			3,
			2,
			3
		] : dash === "dashDotDot" ? [
			6,
			3,
			2,
			3,
			2,
			3
		] : void 0;
		if (intervals === void 0) {
			this.unsupportedOps.add(`strokeDash:${String(dash)}`);
			return;
		}
		if (intervals === null) {
			draw();
			return;
		}
		const effect = this.canvasKit.PathEffect.MakeDash(intervals, 0);
		if (!effect) {
			this.unsupportedOps.add("strokeDash:pathEffectUnavailable");
			return;
		}
		try {
			paint.setPathEffect(effect);
			draw();
			this.currentReplayFeatureCounts.dashedStrokes += 1;
		} finally {
			effect.delete?.();
		}
	}
	imageForOp(op) {
		const base64 = op.base64 ?? "";
		if (!base64) return null;
		if (base64.length > 25165824) {
			this.recordImageFailure(op, "encodedImageRejected", null);
			return null;
		}
		const key = canvasKitImageCacheKey(op, this.documentGeneration);
		if (!key) {
			this.recordImageFailure(op, "cacheKeyMissing", null);
			return null;
		}
		const cached = this.imageCache.get(key);
		if (cached) {
			this.imageCache.delete(key);
			this.imageCache.set(key, cached);
			this.imageCacheHits += 1;
			return cached.image;
		}
		const cachedFailure = this.imageDecodeFailures.get(key);
		if (cachedFailure) {
			this.imageCacheHits += 1;
			this.imageFailureCacheHits += 1;
			this.recordImageFailure(op, cachedFailure, key);
			return null;
		}
		this.imageCacheMisses += 1;
		let bytes;
		try {
			bytes = base64ToBytes(base64);
		} catch {
			this.recordImageFailure(op, "base64DecodeFailed", key);
			return null;
		}
		const encodedHeader = replayableEncodedImageHeader(bytes);
		if (!encodedHeader) {
			this.recordImageFailure(op, "encodedImageRejected", key);
			return null;
		}
		let image = null;
		try {
			image = this.canvasKit.MakeImageFromEncoded(bytes);
		} catch {
			this.recordImageFailure(op, "imageDecodeFailed", key);
			return null;
		}
		if (!image) {
			this.recordImageFailure(op, "imageDecodeFailed", key);
			return null;
		}
		const imageWithDimensions = image;
		const width = typeof imageWithDimensions.width === "function" ? imageWithDimensions.width() : imageWithDimensions.width;
		const height = typeof imageWithDimensions.height === "function" ? imageWithDimensions.height() : imageWithDimensions.height;
		const decodedPixels = typeof width === "number" && typeof height === "number" ? width * height : Number.POSITIVE_INFINITY;
		if (!decodedImageMatchesEncodedHeader(encodedHeader, width, height)) {
			image.delete?.();
			this.recordImageFailure(op, "decodedDimensionsMismatch", key);
			return null;
		}
		while (this.imageCache.size >= CanvasKitLayerRenderer.MAX_IMAGE_CACHE_ENTRIES || this.imageCachePixels + decodedPixels > CanvasKitLayerRenderer.MAX_IMAGE_CACHE_PIXELS) {
			const oldestKey = this.imageCache.keys().next().value;
			if (oldestKey === void 0) break;
			const oldest = this.imageCache.get(oldestKey);
			oldest?.image.delete?.();
			this.imageCache.delete(oldestKey);
			this.imageCachePixels = Math.max(0, this.imageCachePixels - (oldest?.pixels ?? 0));
			this.imageCacheEvictions += 1;
		}
		this.imageCache.set(key, {
			image,
			pixels: decodedPixels
		});
		this.imageCachePixels += decodedPixels;
		return image;
	}
	recordImageFailure(op, reason, key) {
		if (key) {
			if (!this.imageDecodeFailures.has(key) && this.imageDecodeFailures.size >= CanvasKitLayerRenderer.MAX_IMAGE_FAILURE_CACHE_ENTRIES) {
				const oldestKey = this.imageDecodeFailures.keys().next().value;
				if (oldestKey !== void 0) this.imageDecodeFailures.delete(oldestKey);
			}
			this.imageDecodeFailures.set(key, reason);
		}
		const sourceImageKey = boundedCanvasKitSourceImageKey(op.sourceImageKey);
		const imageRef = typeof op.imageRef === "number" && Number.isSafeInteger(op.imageRef) || typeof op.imageRef === "string" && op.imageRef.length > 0 && op.imageRef.length <= 256 && !/[\u0000-\u001f\u007f]/.test(op.imageRef) ? op.imageRef : null;
		const source = sourceImageKey ? "sourceKey" : imageRef !== null ? "resource" : op.base64 ? "inline" : "missing";
		const diagnosticKey = key ?? `${source}:${sourceImageKey ?? String(imageRef ?? op.base64?.length ?? 0)}:${reason}`;
		if (this.currentImageFailures.has(diagnosticKey) || this.currentImageFailures.size >= CanvasKitLayerRenderer.MAX_IMAGE_FAILURE_CACHE_ENTRIES) return;
		this.currentImageFailures.set(diagnosticKey, {
			source,
			sourceImageKey,
			imageRef,
			reason
		});
	}
	makeFillPaint(color, opacity = 1) {
		const paint = new this.canvasKit.Paint();
		paint.setAntiAlias?.(true);
		paint.setStyle(this.canvasKit.PaintStyle.Fill);
		paint.setColor(this.color(color, opacity));
		return paint;
	}
	makeStrokePaint(color, width, opacity = 1) {
		const paint = new this.canvasKit.Paint();
		paint.setAntiAlias?.(true);
		paint.setStyle(this.canvasKit.PaintStyle.Stroke);
		paint.setStrokeWidth(Math.max(.1, width));
		paint.setColor(this.color(color, opacity));
		return paint;
	}
	rect(bounds) {
		return this.canvasKit.XYWHRect(bounds.x, bounds.y, bounds.width, bounds.height);
	}
	color(cssColor, opacity = 1) {
		const { r, g, b, a } = parseCssColor(cssColor);
		const alpha = Math.max(0, Math.min(1, a * opacity));
		return this.canvasKit.Color(r, g, b, alpha);
	}
};
function parseCssColor(value) {
	const trimmed = value.trim();
	if (trimmed === "transparent") return {
		r: 0,
		g: 0,
		b: 0,
		a: 0
	};
	if (trimmed === "black") return {
		r: 0,
		g: 0,
		b: 0,
		a: 1
	};
	if (trimmed === "white") return {
		r: 255,
		g: 255,
		b: 255,
		a: 1
	};
	const shortHex = /^#?([0-9a-f]{3,4})$/i.exec(trimmed);
	if (shortHex) {
		const value = shortHex[1];
		return {
			r: Number.parseInt(value[0] + value[0], 16),
			g: Number.parseInt(value[1] + value[1], 16),
			b: Number.parseInt(value[2] + value[2], 16),
			a: value.length === 4 ? Number.parseInt(value[3] + value[3], 16) / 255 : 1
		};
	}
	const hexWithAlpha = /^#?([0-9a-f]{8})$/i.exec(trimmed);
	if (hexWithAlpha) {
		const n = Number.parseInt(hexWithAlpha[1], 16);
		return {
			r: n >> 24 & 255,
			g: n >> 16 & 255,
			b: n >> 8 & 255,
			a: (n & 255) / 255
		};
	}
	const hex = /^#?([0-9a-f]{6})$/i.exec(trimmed);
	if (hex) {
		const n = Number.parseInt(hex[1], 16);
		return {
			r: n >> 16 & 255,
			g: n >> 8 & 255,
			b: n & 255,
			a: 1
		};
	}
	const rgb = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)$/i.exec(trimmed);
	if (rgb) return {
		r: Number(rgb[1]),
		g: Number(rgb[2]),
		b: Number(rgb[3]),
		a: rgb[4] === void 0 ? 1 : Number(rgb[4])
	};
	return {
		r: 0,
		g: 0,
		b: 0,
		a: 1
	};
}
function clampUnit(value) {
	return Math.max(0, Math.min(1, Number.isFinite(value) ? value ?? 0 : 0));
}
function gradientColors(stops) {
	return (stops ?? []).map((stop) => {
		const rgba = stop.color?.rgba ?? [
			0,
			0,
			0,
			1
		];
		return [
			clampUnit(rgba[0]),
			clampUnit(rgba[1]),
			clampUnit(rgba[2]),
			clampUnit(rgba[3])
		];
	});
}
function gradientPositions(stops) {
	return (stops ?? []).map((stop) => Math.max(0, Math.min(1, stop.offset ?? 0)));
}
function base64ToBytes(base64) {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
	return bytes;
}
//#endregion
export { CanvasKitLayerRenderer };
