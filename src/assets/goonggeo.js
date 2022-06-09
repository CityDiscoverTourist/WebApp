!(function (t) {
  if ("object" == typeof exports && "undefined" != typeof module)
    module.exports = t();
  else if ("function" == typeof define && define.amd) define([], t);
  else {
    var e;
    (e =
      "undefined" != typeof window
        ? window
        : "undefined" != typeof global
        ? global
        : "undefined" != typeof self
        ? self
        : this),
      (e.GoongGeocoder = t());
  }
})(function () {
  return (function () {
    function t(e, n, i) {
      function r(o, a) {
        if (!n[o]) {
          if (!e[o]) {
            var u = "function" == typeof require && require;
            if (!a && u) return u(o, !0);
            if (s) return s(o, !0);
            var l = new Error("Cannot find module '" + o + "'");
            throw ((l.code = "MODULE_NOT_FOUND"), l);
          }
          var c = (n[o] = { exports: {} });
          e[o][0].call(
            c.exports,
            function (t) {
              return r(e[o][1][t] || t);
            },
            c,
            c.exports,
            t,
            e,
            n,
            i
          );
        }
        return n[o].exports;
      }
      for (
        var s = "function" == typeof require && require, o = 0;
        o < i.length;
        o++
      )
        r(i[o]);
      return r;
    }
    return t;
  })()(
    {
      1: [
        function (t, e, n) {
          "use strict";
          function i(t) {
            (this._eventEmitter = new a()),
              (this.options = o({}, this.options, t)),
              (this.inputString = ""),
              (this.fresh = !0),
              (this.lastSelected = null);
          }
          var r = t("suggestions"),
            s = t("lodash.debounce"),
            o = t("xtend"),
            a = t("events").EventEmitter,
            u = t("@goongmaps/goong-sdk"),
            l = t("@goongmaps/goong-sdk/services/autocomplete");
          (i.prototype = {
            options: {
              zoom: 16,
              flyTo: !0,
              trackProximity: !0,
              minLength: 2,
              limit: 5,
              radius: 3e3,
              origin: "https://rsapi.goong.io",
              marker: !0,
              goongjs: null,
              collapsed: !1,
              clearAndBlurOnEsc: !1,
              clearOnBlur: !1,
              getItemValue: function (t) {
                return t.description;
              },
              render: function (t) {
                var e = t.structured_formatting;
                return (
                  '<div class="mapboxgl-ctrl-geocoder--suggestion"><div class="mapboxgl-ctrl-geocoder--suggestion-title">' +
                  e.main_text +
                  '</div><div class="mapboxgl-ctrl-geocoder--suggestion-address">' +
                  e.secondary_text +
                  "</div></div>"
                );
              },
            },
            request: null,
            addTo: function (t) {
              if (t._controlContainer) t.addControl(this);
              else {
                if (
                  "string" != typeof t ||
                  (!t.startsWith("#") && !t.startsWith("."))
                )
                  throw new Error(
                    "Error: addTo Container must be a goong-js map or a html element reference"
                  );
                var e = document.querySelectorAll(t);
                if (0 == e.length) throw new Error("Element ", t, "not found.");
                if (e.length > 1)
                  throw new Error(
                    "Geocoder can only be added to a single html element"
                  );
                e.forEach(
                  function (t) {
                    var e = this.onAdd();
                    t.appendChild(e);
                  }.bind(this)
                );
              }
            },
            onAdd: function (t) {
              t && "string" != typeof t && (this._map = t),
                (this.autoCompleteService = l(
                  u({
                    accessToken: this.options.accessToken,
                    origin: this.options.origin,
                  })
                )),
                (this._onChange = this._onChange.bind(this)),
                (this._onKeyDown = this._onKeyDown.bind(this)),
                (this._onPaste = this._onPaste.bind(this)),
                (this._onBlur = this._onBlur.bind(this)),
                (this._showButton = this._showButton.bind(this)),
                (this._hideButton = this._hideButton.bind(this)),
                (this._onQueryResult = this._onQueryResult.bind(this)),
                (this.clear = this.clear.bind(this)),
                (this._updateProximity = this._updateProximity.bind(this)),
                (this._collapse = this._collapse.bind(this)),
                (this._unCollapse = this._unCollapse.bind(this)),
                (this._clear = this._clear.bind(this)),
                (this._clearOnBlur = this._clearOnBlur.bind(this));
              var e = (this.container = document.createElement("div"));
              e.className = "mapboxgl-ctrl-geocoder mapboxgl-ctrl";
              var n = this.createIcon(
                "search",
                '<path d="M7.4 2.5c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9c1 0 1.8-.2 2.5-.8l3.7 3.7c.2.2.4.3.8.3.7 0 1.1-.4 1.1-1.1 0-.3-.1-.5-.3-.8L11.4 10c.4-.8.8-1.6.8-2.5.1-2.8-2.1-5-4.8-5zm0 1.6c1.8 0 3.2 1.4 3.2 3.2s-1.4 3.2-3.2 3.2-3.3-1.3-3.3-3.1 1.4-3.3 3.3-3.3z"/>'
              );
              (this._inputEl = document.createElement("input")),
                (this._inputEl.type = "text"),
                (this._inputEl.className = "mapboxgl-ctrl-geocoder--input"),
                this.setPlaceholder(),
                this.options.collapsed &&
                  (this._collapse(),
                  this.container.addEventListener(
                    "mouseenter",
                    this._unCollapse
                  ),
                  this.container.addEventListener("mouseleave", this._collapse),
                  this._inputEl.addEventListener("focus", this._unCollapse)),
                (this.options.collapsed || this.options.clearOnBlur) &&
                  this._inputEl.addEventListener("blur", this._onBlur),
                this._inputEl.addEventListener(
                  "keydown",
                  s(this._onKeyDown, 200)
                ),
                this._inputEl.addEventListener("paste", this._onPaste),
                this._inputEl.addEventListener("change", this._onChange),
                this.container.addEventListener("mouseenter", this._showButton),
                this.container.addEventListener("mouseleave", this._hideButton),
                this._inputEl.addEventListener(
                  "keyup",
                  function () {}.bind(this)
                );
              var i = document.createElement("div");
              i.classList.add("mapboxgl-ctrl-geocoder--pin-right"),
                (this._clearEl = document.createElement("button")),
                this._clearEl.setAttribute("aria-label", "Clear"),
                this._clearEl.addEventListener("click", this.clear),
                (this._clearEl.className = "mapboxgl-ctrl-geocoder--button");
              var o = this.createIcon(
                "close",
                '<path d="M3.8 2.5c-.6 0-1.3.7-1.3 1.3 0 .3.2.7.5.8L7.2 9 3 13.2c-.3.3-.5.7-.5 1 0 .6.7 1.3 1.3 1.3.3 0 .7-.2 1-.5L9 10.8l4.2 4.2c.2.3.7.3 1 .3.6 0 1.3-.7 1.3-1.3 0-.3-.2-.7-.3-1l-4.4-4L15 4.6c.3-.2.5-.5.5-.8 0-.7-.7-1.3-1.3-1.3-.3 0-.7.2-1 .3L9 7.1 4.8 2.8c-.3-.1-.7-.3-1-.3z"/>'
              );
              return (
                this._clearEl.appendChild(o),
                (this._loadingEl = this.createIcon(
                  "loading",
                  '<path fill="#333" d="M4.4 4.4l.8.8c2.1-2.1 5.5-2.1 7.6 0l.8-.8c-2.5-2.5-6.7-2.5-9.2 0z"/><path opacity=".1" d="M12.8 12.9c-2.1 2.1-5.5 2.1-7.6 0-2.1-2.1-2.1-5.5 0-7.7l-.8-.8c-2.5 2.5-2.5 6.7 0 9.2s6.6 2.5 9.2 0 2.5-6.6 0-9.2l-.8.8c2.2 2.1 2.2 5.6 0 7.7z"/>'
                )),
                i.appendChild(this._clearEl),
                i.appendChild(this._loadingEl),
                e.appendChild(n),
                e.appendChild(this._inputEl),
                e.appendChild(i),
                (this._typeahead = new r(this._inputEl, [], {
                  filter: !1,
                  minLength: this.options.minLength,
                  limit: this.options.limit,
                })),
                this.setRenderFunction(this.options.render),
                (this._typeahead.getItemValue = this.options.getItemValue),
                (this.mapMarker = null),
                (this._handleMarker = this._handleMarker.bind(this)),
                this._map &&
                  (this.options.trackProximity &&
                    (this._updateProximity(),
                    this._map.on("moveend", this._updateProximity)),
                  (this._goongjs = this.options.goongjs),
                  !this._goongjs &&
                    this.options.marker &&
                    (console.error(
                      "No goongjs detected in options. Map markers are disabled. Please set options.goongjs."
                    ),
                    (this.options.marker = !1))),
                e
              );
            },
            createIcon: function (t, e) {
              var n = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "svg"
              );
              return (
                n.setAttribute(
                  "class",
                  "mapboxgl-ctrl-geocoder--icon mapboxgl-ctrl-geocoder--icon-" +
                    t
                ),
                n.setAttribute("viewBox", "0 0 18 18"),
                n.setAttribute("xml:space", "preserve"),
                n.setAttribute("width", 18),
                n.setAttribute("height", 18),
                (n.innerHTML = e),
                n
              );
            },
            onRemove: function () {
              return (
                this.container.parentNode.removeChild(this.container),
                this.options.trackProximity &&
                  this._map &&
                  this._map.off("moveend", this._updateProximity),
                this._removeMarker(),
                (this._map = null),
                this
              );
            },
            _onPaste: function (t) {
              var e = (t.clipboardData || window.clipboardData).getData("text");
              e.length >= this.options.minLength && this._geocode(e);
            },
            _onKeyDown: function (t) {
              if (27 === t.keyCode && this.options.clearAndBlurOnEsc)
                return this._clear(t), this._inputEl.blur();
              var e =
                t.target && t.target.shadowRoot
                  ? t.target.shadowRoot.activeElement
                  : t.target;
              if (!(e ? e.value : ""))
                return (
                  (this.fresh = !0),
                  9 !== t.keyCode && this.clear(t),
                  (this._clearEl.style.display = "none")
                );
              t.metaKey ||
                -1 !== [9, 27, 37, 39, 13, 38, 40].indexOf(t.keyCode) ||
                (e.value.length >= this.options.minLength &&
                  this._geocode(e.value));
            },
            _showButton: function () {
              this._typeahead.selected &&
                (this._clearEl.style.display = "block");
            },
            _hideButton: function () {
              this._typeahead.selected &&
                (this._clearEl.style.display = "none");
            },
            _onBlur: function (t) {
              this.options.clearOnBlur && this._clearOnBlur(t),
                this.options.collapsed && this._collapse();
            },
            _onChange: function () {
              var t = this._typeahead.selected;
              if (t && JSON.stringify(t) !== this.lastSelected) {
                if (!this.options.flyTo) return;
                var e = this.autoCompleteService
                  .placeDetail({ placeid: t.place_id })
                  .send();
                return (
                  e.then(
                    function (e) {
                      this._clearEl.style.display = "none";
                      var n,
                        i = e.body,
                        r = { zoom: this.options.zoom };
                      n = o({}, r, this.options.flyTo);
                      var s = i.result.geometry.location.lat,
                        a = i.result.geometry.location.lng;
                      (n.center = [a, s]),
                        this._map && this._map.flyTo(n),
                        this.options.marker &&
                          this._goongjs &&
                          this._handleMarker(i),
                        this._inputEl.focus(),
                        (this._inputEl.scrollLeft = 0),
                        this._inputEl.setSelectionRange(0, 0),
                        (this.lastSelected = JSON.stringify(t)),
                        this._eventEmitter.emit("result", { result: i });
                    }.bind(this)
                  ),
                  e.catch(
                    function (t) {
                      this._eventEmitter.emit("error", { error: t });
                    }.bind(this)
                  ),
                  e
                );
              }
            },
            _geocode: function (t) {
              (this._loadingEl.style.display = "block"),
                this._eventEmitter.emit("loading", { query: t }),
                (this.inputString = t);
              var e,
                n = { input: t, radius: this.options.radius };
              return (
                this.options.trackProximity &&
                  this._map &&
                  this.options.proximity &&
                  this.options.proximity.latitude &&
                  this.options.proximity.longitude &&
                  (n = o(n, {
                    location:
                      this.options.proximity.latitude +
                      "," +
                      this.options.proximity.longitude,
                  })),
                (e = this.autoCompleteService.search(n).send()),
                e.then(
                  function (t) {
                    var e = t.body;
                    (this._loadingEl.style.display = "none"),
                      this.fresh && (this.fresh = !1),
                      e.predictions.length
                        ? ((this._clearEl.style.display = "block"),
                          this._eventEmitter.emit("results", e),
                          this._typeahead.update(e.predictions))
                        : ((this._clearEl.style.display = "none"),
                          (this._typeahead.selected = null),
                          this._renderNoResults(),
                          this._eventEmitter.emit("results", e));
                  }.bind(this)
                ),
                e.catch(
                  function (t) {
                    (t && 0 === t.status) ||
                      ((this._loadingEl.style.display = "none"),
                      (this._clearEl.style.display = "none"),
                      (this._typeahead.selected = null),
                      this._renderError(),
                      this._eventEmitter.emit("results", { predictions: [] }),
                      this._eventEmitter.emit("error", { error: t }));
                  }.bind(this)
                ),
                e
              );
            },
            _clear: function (t) {
              t && t.preventDefault(),
                (this._inputEl.value = ""),
                (this._typeahead.selected = null),
                this._typeahead.clear(),
                this._onChange(),
                (this._clearEl.style.display = "none"),
                this._removeMarker(),
                (this.lastSelected = null),
                this._eventEmitter.emit("clear"),
                (this.fresh = !0);
            },
            clear: function (t) {
              this._clear(t), this._inputEl.focus();
            },
            _clearOnBlur: function (t) {
              var e = this;
              t.relatedTarget && e._clear(t);
            },
            _onQueryResult: function (t) {
              var e = t.result;
              (this._typeahead.selected = e),
                (this._inputEl.value = e.geometry.name);
            },
            _updateProximity: function () {
              if (this._map)
                if (this._map.getZoom() > 9) {
                  var t = this._map.getCenter().wrap();
                  this.setProximity({ longitude: t.lng, latitude: t.lat });
                } else this.setProximity(null);
            },
            _collapse: function () {
              this._inputEl.value ||
                this._inputEl === document.activeElement ||
                this.container.classList.add(
                  "mapboxgl-ctrl-geocoder--collapsed"
                );
            },
            _unCollapse: function () {
              this.container.classList.remove(
                "mapboxgl-ctrl-geocoder--collapsed"
              );
            },
            query: function (t) {
              return this._geocode(t).then(this._onQueryResult), this;
            },
            _renderError: function () {
              this._renderMessage(
                "<div class='goong-js-geocoder--error'>There was an error reaching the server</div>"
              );
            },
            _renderNoResults: function () {
              this._renderMessage(
                "<div class='goong-js-geocoder--error mapboxgl-gl-geocoder--no-results'>No results found</div>"
              );
            },
            _renderMessage: function (t) {
              this._typeahead.update([]),
                (this._typeahead.selected = null),
                this._typeahead.clear(),
                this._typeahead.renderError(t);
            },
            _getPlaceholderText: function () {
              return this.options.placeholder
                ? this.options.placeholder
                : "Search";
            },
            setInput: function (t) {
              return (
                (this._inputEl.value = t),
                (this._typeahead.selected = null),
                this._typeahead.clear(),
                t.length >= this.options.minLength && this._geocode(t),
                this
              );
            },
            getInput: function () {
              return this._inputEl.value;
            },
            setProximity: function (t) {
              return (this.options.proximity = t), this;
            },
            getProximity: function () {
              return this.options.proximity;
            },
            setRenderFunction: function (t) {
              return (
                t && "function" == typeof t && (this._typeahead.render = t),
                this
              );
            },
            getRenderFunction: function () {
              return this._typeahead.render;
            },
            getZoom: function () {
              return this.options.zoom;
            },
            setZoom: function (t) {
              return (this.options.zoom = t), this;
            },
            getFlyTo: function () {
              return this.options.flyTo;
            },
            setFlyTo: function (t) {
              return (this.options.flyTo = t), this;
            },
            getPlaceholder: function () {
              return this.options.placeholder;
            },
            setPlaceholder: function (t) {
              return (
                (this.placeholder = t || this._getPlaceholderText()),
                (this._inputEl.placeholder = this.placeholder),
                this._inputEl.setAttribute("aria-label", this.placeholder),
                this
              );
            },
            getMinLength: function () {
              return this.options.minLength;
            },
            setMinLength: function (t) {
              return (
                (this.options.minLength = t),
                this._typeahead && (this._typeahead.minLength = t),
                this
              );
            },
            getLimit: function () {
              return this.options.limit;
            },
            setLimit: function (t) {
              return (
                (this.options.limit = t),
                this._typeahead && (this._typeahead.options.limit = t),
                this
              );
            },
            getRadius: function () {
              return this.options.radius;
            },
            setRadius: function (t) {
              return (
                (this.options.radius = t),
                this._typeahead && (this._typeahead.options.radius = t),
                this
              );
            },
            setOrigin: function (t) {
              return (
                (this.options.origin = t),
                (this.autoCompleteService = l(
                  u({
                    accessToken: this.options.accessToken,
                    origin: this.options.origin,
                  })
                )),
                this
              );
            },
            getOrigin: function () {
              return this.options.origin;
            },
            _handleMarker: function (t) {
              if (this._map) {
                this._removeMarker();
                var e = { color: "#469af7" },
                  n = o({}, e, this.options.marker);
                return (
                  (this.mapMarker = new this._goongjs.Marker(n)),
                  this.mapMarker
                    .setLngLat([
                      t.result.geometry.location.lng,
                      t.result.geometry.location.lat,
                    ])
                    .addTo(this._map),
                  this
                );
              }
            },
            _removeMarker: function () {
              this.mapMarker &&
                (this.mapMarker.remove(), (this.mapMarker = null));
            },
            on: function (t, e) {
              return this._eventEmitter.on(t, e), this;
            },
            off: function (t, e) {
              return this._eventEmitter.removeListener(t, e), this;
            },
          }),
            (e.exports = i);
        },
        {
          "@goongmaps/goong-sdk": 2,
          "@goongmaps/goong-sdk/services/autocomplete": 13,
          events: 18,
          "lodash.debounce": 21,
          suggestions: 22,
          xtend: 25,
        },
      ],
      2: [
        function (t, e, n) {
          "use strict";
          var i = t("./lib/client");
          e.exports = i;
        },
        { "./lib/client": 3 },
      ],
      3: [
        function (t, e, n) {
          "use strict";
          function i(t) {
            o.call(this, t);
          }
          function r(t) {
            return new i(t);
          }
          var s = t("./browser-layer"),
            o = t("../classes/gapi-client");
          (i.prototype = Object.create(o.prototype)),
            (i.prototype.constructor = i),
            (i.prototype.sendRequest = s.browserSend),
            (i.prototype.abortRequest = s.browserAbort),
            (e.exports = r);
        },
        { "../classes/gapi-client": 5, "./browser-layer": 4 },
      ],
      4: [
        function (t, e, n) {
          "use strict";
          function i(t) {
            var e = f[t.id];
            e && (e.abort(), delete f[t.id]);
          }
          function r(t, e) {
            return new l(t, {
              body: e.response,
              headers: p(e.getAllResponseHeaders()),
              statusCode: e.status,
            });
          }
          function s(t) {
            var e = t.total,
              n = t.loaded;
            return { total: e, transferred: n, percent: (100 * n) / e };
          }
          function o(t, e) {
            return new Promise(function (n, i) {
              e.onprogress = function (e) {
                t.emitter.emit(h.EVENT_PROGRESS_DOWNLOAD, s(e));
              };
              var r = t.file;
              r &&
                (e.upload.onprogress = function (e) {
                  t.emitter.emit(h.EVENT_PROGRESS_UPLOAD, s(e));
                }),
                (e.onerror = function (t) {
                  i(t);
                }),
                (e.onabort = function () {
                  var e = new c({ request: t, type: h.ERROR_REQUEST_ABORTED });
                  i(e);
                }),
                (e.onload = function () {
                  if ((delete f[t.id], e.status < 200 || e.status >= 400)) {
                    var r = new c({
                      request: t,
                      body: e.response,
                      statusCode: e.status,
                    });
                    return void i(r);
                  }
                  n(e);
                });
              var o = t.body;
              "string" == typeof o
                ? e.send(o)
                : o
                ? e.send(JSON.stringify(o))
                : r
                ? e.send(r)
                : e.send(),
                (f[t.id] = e);
            }).then(function (e) {
              return r(t, e);
            });
          }
          function a(t, e) {
            var n = t.url(e),
              i = new window.XMLHttpRequest();
            return (
              i.open(t.method, n),
              Object.keys(t.headers).forEach(function (e) {
                i.setRequestHeader(e, t.headers[e]);
              }),
              (i.timeout = t.timeout),
              i
            );
          }
          function u(t) {
            return Promise.resolve().then(function () {
              var e = a(t, t.client.accessToken);
              return o(t, e);
            });
          }
          var l = t("../classes/gapi-response"),
            c = t("../classes/gapi-error"),
            h = t("../constants"),
            p = t("../helpers/parse-headers"),
            f = {};
          e.exports = {
            browserAbort: i,
            sendRequestXhr: o,
            browserSend: u,
            createRequestXhr: a,
          };
        },
        {
          "../classes/gapi-error": 6,
          "../classes/gapi-response": 8,
          "../constants": 9,
          "../helpers/parse-headers": 10,
        },
      ],
      5: [
        function (t, e, n) {
          "use strict";
          function i(t) {
            if (!t || !t.accessToken)
              throw new Error("Cannot create a client without an API key");
            (this.accessToken = t.accessToken),
              (this.origin = t.origin || s.API_ORIGIN);
          }
          var r = t("./gapi-request"),
            s = t("../constants");
          (i.prototype.createRequest = function (t) {
            return new r(this, t);
          }),
            (e.exports = i);
        },
        { "../constants": 9, "./gapi-request": 7 },
      ],
      6: [
        function (t, e, n) {
          "use strict";
          function i(t) {
            var e,
              n = t.type || r.ERROR_HTTP;
            if (t.body)
              try {
                e = JSON.parse(t.body);
              } catch (n) {
                e = t.body;
              }
            else e = null;
            var i = t.message || null;
            i ||
              ("string" == typeof e
                ? (i = e)
                : e && "string" == typeof e.message
                ? (i = e.message)
                : n === r.ERROR_REQUEST_ABORTED && (i = "Request aborted")),
              (this.message = i),
              (this.type = n),
              (this.statusCode = t.statusCode || null),
              (this.request = t.request),
              (this.body = e);
          }
          var r = t("../constants");
          e.exports = i;
        },
        { "../constants": 9 },
      ],
      7: [
        function (t, e, n) {
          "use strict";
          function i(t, e) {
            if (!t) throw new Error("GAPIRequest requires a client");
            if (!e || !e.path || !e.method)
              throw new Error(
                "GAPIRequest requires an options object with path and method properties"
              );
            var n = {};
            e.body && (n["content-type"] = "application/json");
            var i = r(n, e.headers),
              o = Object.keys(i).reduce(function (t, e) {
                return (t[e.toLowerCase()] = i[e]), t;
              }, {});
            (this.id = u++),
              (this._options = e),
              (this.emitter = new s()),
              (this.client = t),
              (this.response = null),
              (this.error = null),
              (this.sent = !1),
              (this.aborted = !1),
              (this.path = e.path),
              (this.method = e.method),
              (this.origin = e.origin || t.origin),
              (this.query = e.query || {}),
              (this.params = e.params || {}),
              (this.body = e.body || null),
              (this.file = e.file || null),
              (this.encoding = e.encoding || "utf8"),
              (this.sendFileAs = e.sendFileAs || null),
              (this.headers = o),
              (this.timeout = e.timeout || 500);
          }
          var r = t("xtend"),
            s = t("eventemitter3"),
            o = t("../helpers/url-utils"),
            a = t("../constants"),
            u = 1;
          (i.prototype.url = function (t) {
            var e = o.prependOrigin(this.path, this.origin);
            e = o.appendQueryObject(e, this.query);
            var n = this.params,
              i = null == t ? this.client.accessToken : t;
            return (
              i && (e = o.appendQueryParam(e, "api_key", i)),
              (e = o.interpolateRouteParams(e, n)),
              e
            );
          }),
            (i.prototype.send = function () {
              var t = this;
              if (t.sent)
                throw new Error(
                  "This request has already been sent. Check the response and error properties. Create a new request with clone()."
                );
              return (
                (t.sent = !0),
                t.client.sendRequest(t).then(
                  function (e) {
                    return (
                      (t.response = e), t.emitter.emit(a.EVENT_RESPONSE, e), e
                    );
                  },
                  function (e) {
                    throw ((t.error = e), t.emitter.emit(a.EVENT_ERROR, e), e);
                  }
                )
              );
            }),
            (i.prototype.abort = function () {
              this._nextPageRequest &&
                (this._nextPageRequest.abort(), delete this._nextPageRequest),
                this.response ||
                  this.error ||
                  this.aborted ||
                  ((this.aborted = !0), this.client.abortRequest(this));
            }),
            (i.prototype.eachPage = function (t) {
              function e(e) {
                function n() {
                  delete r._nextPageRequest;
                  var t = e.nextPage();
                  t && ((r._nextPageRequest = t), i(t));
                }
                t(null, e, n);
              }
              function n(e) {
                t(e, null, function () {});
              }
              function i(t) {
                t.send().then(e, n);
              }
              var r = this;
              i(this);
            }),
            (i.prototype.clone = function () {
              return this._extend();
            }),
            (i.prototype._extend = function (t) {
              var e = r(this._options, t);
              return new i(this.client, e);
            }),
            (e.exports = i);
        },
        {
          "../constants": 9,
          "../helpers/url-utils": 12,
          eventemitter3: 17,
          xtend: 25,
        },
      ],
      8: [
        function (t, e, n) {
          "use strict";
          function i(t, e) {
            (this.request = t),
              (this.headers = e.headers),
              (this.rawBody = e.body),
              (this.statusCode = e.statusCode);
            try {
              this.body = JSON.parse(e.body || "{}");
            } catch (t) {
              this.body = e.body;
            }
            this.links = r(this.headers.link);
          }
          var r = t("../helpers/parse-link-header");
          (i.prototype.hasNextPage = function () {
            return !!this.links.next;
          }),
            (i.prototype.nextPage = function () {
              return this.hasNextPage()
                ? this.request._extend({ path: this.links.next.url })
                : null;
            }),
            (e.exports = i);
        },
        { "../helpers/parse-link-header": 11 },
      ],
      9: [
        function (t, e, n) {
          "use strict";
          e.exports = {
            API_ORIGIN: "https://rsapi.goong.io",
            EVENT_PROGRESS_DOWNLOAD: "downloadProgress",
            EVENT_PROGRESS_UPLOAD: "uploadProgress",
            EVENT_ERROR: "error",
            EVENT_RESPONSE: "response",
            ERROR_HTTP: "HttpError",
            ERROR_REQUEST_ABORTED: "RequestAbortedError",
          };
        },
        {},
      ],
      10: [
        function (t, e, n) {
          "use strict";
          function i(t) {
            var e = t.indexOf(":");
            return {
              name: t.substring(0, e).trim().toLowerCase(),
              value: t.substring(e + 1).trim(),
            };
          }
          function r(t) {
            var e = {};
            return t
              ? (t
                  .trim()
                  .split(/[\r|\n]+/)
                  .forEach(function (t) {
                    var n = i(t);
                    e[n.name] = n.value;
                  }),
                e)
              : e;
          }
          e.exports = r;
        },
        {},
      ],
      11: [
        function (t, e, n) {
          "use strict";
          function i(t) {
            var e = t.match(/\s*(.+)\s*=\s*"?([^"]+)"?/);
            return e ? { key: e[1], value: e[2] } : null;
          }
          function r(t) {
            var e = t.match(/<?([^>]*)>(.*)/);
            if (!e) return null;
            var n = e[1],
              r = e[2].split(";"),
              s = null,
              o = r.reduce(function (t, e) {
                var n = i(e);
                return n
                  ? "rel" === n.key
                    ? (s || (s = n.value), t)
                    : ((t[n.key] = n.value), t)
                  : t;
              }, {});
            return s ? { url: n, rel: s, params: o } : null;
          }
          function s(t) {
            return t
              ? t.split(/,\s*</).reduce(function (t, e) {
                  var n = r(e);
                  return n
                    ? (n.rel.split(/\s+/).forEach(function (e) {
                        t[e] || (t[e] = { url: n.url, params: n.params });
                      }),
                      t)
                    : t;
                }, {})
              : {};
          }
          e.exports = s;
        },
        {},
      ],
      12: [
        function (t, e, n) {
          "use strict";
          function i(t) {
            return t.map(encodeURIComponent).join(",");
          }
          function r(t) {
            return Array.isArray(t) ? i(t) : encodeURIComponent(String(t));
          }
          function s(t, e, n) {
            if (!1 === n || null === n) return t;
            var i = /\?/.test(t) ? "&" : "?",
              s = encodeURIComponent(e);
            return (
              void 0 !== n && "" !== n && !0 !== n && (s += "=" + r(n)),
              "" + t + i + s
            );
          }
          function o(t, e) {
            if (!e) return t;
            var n = t;
            return (
              Object.keys(e).forEach(function (t) {
                var i = e[t];
                void 0 !== i &&
                  (Array.isArray(i) &&
                    (i = i
                      .filter(function (t) {
                        return !!t;
                      })
                      .join(",")),
                  (n = s(n, t, i)));
              }),
              n
            );
          }
          function a(t, e) {
            if (!e) return t;
            if ("http" === t.slice(0, 4)) return t;
            var n = "/" === t[0] ? "" : "/";
            return "" + e.replace(/\/$/, "") + n + t;
          }
          function u(t, e) {
            return e
              ? t.replace(/\/:([a-zA-Z0-9]+)/g, function (t, n) {
                  var i = e[n];
                  if (void 0 === i)
                    throw new Error("Unspecified route parameter " + n);
                  return "/" + r(i);
                })
              : t;
          }
          e.exports = {
            appendQueryObject: o,
            appendQueryParam: s,
            prependOrigin: a,
            interpolateRouteParams: u,
          };
        },
        {},
      ],
      13: [
        function (t, e, n) {
          "use strict";
          var i = t("./service-helpers/validator"),
            r = t("./service-helpers/create-service-factory"),
            s = {};
          (s.search = function (t) {
            return (
              i.assertShape({
                input: i.required(i.string),
                location: i.string,
                radius: i.number,
                limit: i.number,
              })(t),
              this.client.createRequest({
                method: "GET",
                path: "/place/autocomplete",
                query: t,
              })
            );
          }),
            (s.placeDetail = function (t) {
              return (
                i.assertShape({ placeid: i.required(i.string) })(t),
                this.client.createRequest({
                  method: "GET",
                  path: "/place/detail",
                  query: t,
                })
              );
            }),
            (e.exports = r(s));
        },
        {
          "./service-helpers/create-service-factory": 14,
          "./service-helpers/validator": 15,
        },
      ],
      14: [
        function (t, e, n) {
          "use strict";
          function i(t) {
            return function (e) {
              var n;
              n = r.prototype.isPrototypeOf.call(e) ? e : s(e);
              var i = Object.create(t);
              return (i.client = n), i;
            };
          }
          var r = t("../../lib/classes/gapi-client"),
            s = t("../../lib/client");
          e.exports = i;
        },
        { "../../lib/classes/gapi-client": 5, "../../lib/client": 3 },
      ],
      15: [
        function (t, e, n) {
          (function (n) {
            (function () {
              "use strict";
              function i(t) {
                if ("undefined" != typeof window) {
                  if (t instanceof n.Blob || t instanceof n.ArrayBuffer) return;
                  return "Blob or ArrayBuffer";
                }
                if ("string" != typeof t && void 0 === t.pipe)
                  return "Filename or Readable stream";
              }
              function r(t, e) {
                return u.assert(u.strictShape(t), e);
              }
              function s(t) {
                if ("boolean" == typeof t) return "date";
                try {
                  var e = new Date(t);
                  if (e.getTime && isNaN(e.getTime())) return "date";
                } catch (t) {
                  return "date";
                }
              }
              function o(t) {
                return u.tuple(u.number, u.number)(t);
              }
              var a = t("xtend"),
                u = t("@mapbox/fusspot");
              e.exports = a(u, {
                file: i,
                date: s,
                coordinates: o,
                assertShape: r,
              });
            }.call(this));
          }.call(
            this,
            "undefined" != typeof global
              ? global
              : "undefined" != typeof self
              ? self
              : "undefined" != typeof window
              ? window
              : {}
          ));
        },
        { "@mapbox/fusspot": 16, xtend: 25 },
      ],
      16: [
        function (t, e, n) {
          "use strict";
          function i(t) {
            var e = Array.isArray(t),
              n = function (n) {
                return e ? t[n] : t;
              };
            return function (i) {
              var s = r(v.plainArray, i);
              if (s) return s;
              if (e && i.length !== t.length)
                return "an array with " + t.length + " items";
              for (var o = 0; o < i.length; o++)
                if ((s = r(n(o), i[o]))) return [o].concat(s);
            };
          }
          function r(t, e) {
            if (null != e || t.hasOwnProperty("__required")) {
              var n = t(e);
              return n ? (Array.isArray(n) ? n : [n]) : void 0;
            }
          }
          function s(t, e) {
            var n = t.length,
              i = t[n - 1],
              r = t.slice(0, n - 1);
            return (
              0 === r.length && (r = [d]),
              (e = f(e, { path: r })),
              "function" == typeof i ? i(e) : l(e, a(i))
            );
          }
          function o(t) {
            return t.length < 2
              ? t[0]
              : 2 === t.length
              ? t.join(" or ")
              : t.slice(0, -1).join(", ") + ", or " + t.slice(-1);
          }
          function a(t) {
            return "must be " + u(t) + ".";
          }
          function u(t) {
            return /^an? /.test(t)
              ? t
              : /^[aeiou]/i.test(t)
              ? "an " + t
              : /^[a-z]/i.test(t)
              ? "a " + t
              : t;
          }
          function l(t, e) {
            var n = c(t.path),
              i = t.path.join(".") + " " + e;
            return (n ? "Item at position " : "") + i;
          }
          function c(t) {
            return (
              "number" == typeof t[t.length - 1] || "number" == typeof t[0]
            );
          }
          function h(t) {
            return Object.keys(t || {}).map(function (e) {
              return { key: e, value: t[e] };
            });
          }
          var p = t("is-plain-obj"),
            f = t("xtend"),
            d = "value",
            v = {};
          (v.assert = function (t, e) {
            return (
              (e = e || {}),
              function (n) {
                var i = r(t, n);
                if (i) {
                  var o = s(i, e);
                  throw (e.apiName && (o = e.apiName + ": " + o), new Error(o));
                }
              }
            );
          }),
            (v.shape = function (t) {
              var e = h(t);
              return function (t) {
                var n = r(v.plainObject, t);
                if (n) return n;
                for (var i, o, a = [], u = 0; u < e.length; u++)
                  (i = e[u].key),
                    (o = e[u].value),
                    (n = r(o, t[i])) && a.push([i].concat(n));
                return a.length < 2
                  ? a[0]
                  : function (t) {
                      a = a.map(function (e) {
                        return (
                          "- " + e[0] + ": " + s(e, t).split("\n").join("\n  ")
                        );
                      });
                      var e = t.path.join(".");
                      return (
                        "The following properties" +
                        (e === d ? "" : " of " + e) +
                        " have invalid values:\n  " +
                        a.join("\n  ")
                      );
                    };
              };
            }),
            (v.strictShape = function (t) {
              var e = v.shape(t);
              return function (n) {
                var i = e(n);
                if (i) return i;
                var r = Object.keys(n).reduce(function (e, n) {
                  return void 0 === t[n] && e.push(n), e;
                }, []);
                return 0 !== r.length
                  ? function () {
                      return "The following keys are invalid: " + r.join(", ");
                    }
                  : void 0;
              };
            }),
            (v.arrayOf = function (t) {
              return i(t);
            }),
            (v.tuple = function () {
              return i(
                Array.isArray(arguments[0])
                  ? arguments[0]
                  : Array.prototype.slice.call(arguments)
              );
            }),
            (v.required = function (t) {
              function e(e) {
                return null == e
                  ? function (t) {
                      return l(
                        t,
                        c(t.path) ? "cannot be undefined/null." : "is required."
                      );
                    }
                  : t.apply(this, arguments);
              }
              return (e.__required = !0), e;
            }),
            (v.oneOfType = function () {
              var t = Array.isArray(arguments[0])
                ? arguments[0]
                : Array.prototype.slice.call(arguments);
              return function (e) {
                var n = t
                  .map(function (t) {
                    return r(t, e);
                  })
                  .filter(Boolean);
                if (n.length === t.length)
                  return n.every(function (t) {
                    return 1 === t.length && "string" == typeof t[0];
                  })
                    ? o(
                        n.map(function (t) {
                          return t[0];
                        })
                      )
                    : n.reduce(function (t, e) {
                        return e.length > t.length ? e : t;
                      });
              };
            }),
            (v.equal = function (t) {
              return function (e) {
                if (e !== t) return JSON.stringify(t);
              };
            }),
            (v.oneOf = function () {
              var t = Array.isArray(arguments[0])
                  ? arguments[0]
                  : Array.prototype.slice.call(arguments),
                e = t.map(function (t) {
                  return v.equal(t);
                });
              return v.oneOfType.apply(this, e);
            }),
            (v.range = function (t) {
              var e = t[0],
                n = t[1];
              return function (t) {
                if (r(v.number, t) || t < e || t > n)
                  return "number between " + e + " & " + n + " (inclusive)";
              };
            }),
            (v.any = function () {}),
            (v.boolean = function (t) {
              if ("boolean" != typeof t) return "boolean";
            }),
            (v.number = function (t) {
              if ("number" != typeof t) return "number";
            }),
            (v.plainArray = function (t) {
              if (!Array.isArray(t)) return "array";
            }),
            (v.plainObject = function (t) {
              if (!p(t)) return "object";
            }),
            (v.string = function (t) {
              if ("string" != typeof t) return "string";
            }),
            (v.func = function (t) {
              if ("function" != typeof t) return "function";
            }),
            (v.validate = r),
            (v.processMessage = s),
            (e.exports = v);
        },
        { "is-plain-obj": 20, xtend: 25 },
      ],
      17: [
        function (t, e, n) {
          "use strict";
          function i() {}
          function r(t, e, n) {
            (this.fn = t), (this.context = e), (this.once = n || !1);
          }
          function s(t, e, n, i, s) {
            if ("function" != typeof n)
              throw new TypeError("The listener must be a function");
            var o = new r(n, i || t, s),
              a = l ? l + e : e;
            return (
              t._events[a]
                ? t._events[a].fn
                  ? (t._events[a] = [t._events[a], o])
                  : t._events[a].push(o)
                : ((t._events[a] = o), t._eventsCount++),
              t
            );
          }
          function o(t, e) {
            0 == --t._eventsCount ? (t._events = new i()) : delete t._events[e];
          }
          function a() {
            (this._events = new i()), (this._eventsCount = 0);
          }
          var u = Object.prototype.hasOwnProperty,
            l = "~";
          Object.create &&
            ((i.prototype = Object.create(null)),
            new i().__proto__ || (l = !1)),
            (a.prototype.eventNames = function () {
              var t,
                e,
                n = [];
              if (0 === this._eventsCount) return n;
              for (e in (t = this._events))
                u.call(t, e) && n.push(l ? e.slice(1) : e);
              return Object.getOwnPropertySymbols
                ? n.concat(Object.getOwnPropertySymbols(t))
                : n;
            }),
            (a.prototype.listeners = function (t) {
              var e = l ? l + t : t,
                n = this._events[e];
              if (!n) return [];
              if (n.fn) return [n.fn];
              for (var i = 0, r = n.length, s = new Array(r); i < r; i++)
                s[i] = n[i].fn;
              return s;
            }),
            (a.prototype.listenerCount = function (t) {
              var e = l ? l + t : t,
                n = this._events[e];
              return n ? (n.fn ? 1 : n.length) : 0;
            }),
            (a.prototype.emit = function (t, e, n, i, r, s) {
              var o = l ? l + t : t;
              if (!this._events[o]) return !1;
              var a,
                u,
                c = this._events[o],
                h = arguments.length;
              if (c.fn) {
                switch (
                  (c.once && this.removeListener(t, c.fn, void 0, !0), h)
                ) {
                  case 1:
                    return c.fn.call(c.context), !0;
                  case 2:
                    return c.fn.call(c.context, e), !0;
                  case 3:
                    return c.fn.call(c.context, e, n), !0;
                  case 4:
                    return c.fn.call(c.context, e, n, i), !0;
                  case 5:
                    return c.fn.call(c.context, e, n, i, r), !0;
                  case 6:
                    return c.fn.call(c.context, e, n, i, r, s), !0;
                }
                for (u = 1, a = new Array(h - 1); u < h; u++)
                  a[u - 1] = arguments[u];
                c.fn.apply(c.context, a);
              } else {
                var p,
                  f = c.length;
                for (u = 0; u < f; u++)
                  switch (
                    (c[u].once && this.removeListener(t, c[u].fn, void 0, !0),
                    h)
                  ) {
                    case 1:
                      c[u].fn.call(c[u].context);
                      break;
                    case 2:
                      c[u].fn.call(c[u].context, e);
                      break;
                    case 3:
                      c[u].fn.call(c[u].context, e, n);
                      break;
                    case 4:
                      c[u].fn.call(c[u].context, e, n, i);
                      break;
                    default:
                      if (!a)
                        for (p = 1, a = new Array(h - 1); p < h; p++)
                          a[p - 1] = arguments[p];
                      c[u].fn.apply(c[u].context, a);
                  }
              }
              return !0;
            }),
            (a.prototype.on = function (t, e, n) {
              return s(this, t, e, n, !1);
            }),
            (a.prototype.once = function (t, e, n) {
              return s(this, t, e, n, !0);
            }),
            (a.prototype.removeListener = function (t, e, n, i) {
              var r = l ? l + t : t;
              if (!this._events[r]) return this;
              if (!e) return o(this, r), this;
              var s = this._events[r];
              if (s.fn)
                s.fn !== e ||
                  (i && !s.once) ||
                  (n && s.context !== n) ||
                  o(this, r);
              else {
                for (var a = 0, u = [], c = s.length; a < c; a++)
                  (s[a].fn !== e ||
                    (i && !s[a].once) ||
                    (n && s[a].context !== n)) &&
                    u.push(s[a]);
                u.length
                  ? (this._events[r] = 1 === u.length ? u[0] : u)
                  : o(this, r);
              }
              return this;
            }),
            (a.prototype.removeAllListeners = function (t) {
              var e;
              return (
                t
                  ? ((e = l ? l + t : t), this._events[e] && o(this, e))
                  : ((this._events = new i()), (this._eventsCount = 0)),
                this
              );
            }),
            (a.prototype.off = a.prototype.removeListener),
            (a.prototype.addListener = a.prototype.on),
            (a.prefixed = l),
            (a.EventEmitter = a),
            void 0 !== e && (e.exports = a);
        },
        {},
      ],
      18: [
        function (t, e, n) {
          function i() {
            (this._events &&
              Object.prototype.hasOwnProperty.call(this, "_events")) ||
              ((this._events = E(null)), (this._eventsCount = 0)),
              (this._maxListeners = this._maxListeners || void 0);
          }
          function r(t) {
            return void 0 === t._maxListeners
              ? i.defaultMaxListeners
              : t._maxListeners;
          }
          function s(t, e, n) {
            if (e) t.call(n);
            else
              for (var i = t.length, r = y(t, i), s = 0; s < i; ++s)
                r[s].call(n);
          }
          function o(t, e, n, i) {
            if (e) t.call(n, i);
            else
              for (var r = t.length, s = y(t, r), o = 0; o < r; ++o)
                s[o].call(n, i);
          }
          function a(t, e, n, i, r) {
            if (e) t.call(n, i, r);
            else
              for (var s = t.length, o = y(t, s), a = 0; a < s; ++a)
                o[a].call(n, i, r);
          }
          function u(t, e, n, i, r, s) {
            if (e) t.call(n, i, r, s);
            else
              for (var o = t.length, a = y(t, o), u = 0; u < o; ++u)
                a[u].call(n, i, r, s);
          }
          function l(t, e, n, i) {
            if (e) t.apply(n, i);
            else
              for (var r = t.length, s = y(t, r), o = 0; o < r; ++o)
                s[o].apply(n, i);
          }
          function c(t, e, n, i) {
            var s, o, a;
            if ("function" != typeof n)
              throw new TypeError('"listener" argument must be a function');
            if (
              ((o = t._events),
              o
                ? (o.newListener &&
                    (t.emit("newListener", e, n.listener ? n.listener : n),
                    (o = t._events)),
                  (a = o[e]))
                : ((o = t._events = E(null)), (t._eventsCount = 0)),
              a)
            ) {
              if (
                ("function" == typeof a
                  ? (a = o[e] = i ? [n, a] : [a, n])
                  : i
                  ? a.unshift(n)
                  : a.push(n),
                !a.warned && (s = r(t)) && s > 0 && a.length > s)
              ) {
                a.warned = !0;
                var u = new Error(
                  "Possible EventEmitter memory leak detected. " +
                    a.length +
                    ' "' +
                    String(e) +
                    '" listeners added. Use emitter.setMaxListeners() to increase limit.'
                );
                (u.name = "MaxListenersExceededWarning"),
                  (u.emitter = t),
                  (u.type = e),
                  (u.count = a.length),
                  "object" == typeof console &&
                    console.warn &&
                    console.warn("%s: %s", u.name, u.message);
              }
            } else (a = o[e] = n), ++t._eventsCount;
            return t;
          }
          function h() {
            if (!this.fired)
              switch (
                (this.target.removeListener(this.type, this.wrapFn),
                (this.fired = !0),
                arguments.length)
              ) {
                case 0:
                  return this.listener.call(this.target);
                case 1:
                  return this.listener.call(this.target, arguments[0]);
                case 2:
                  return this.listener.call(
                    this.target,
                    arguments[0],
                    arguments[1]
                  );
                case 3:
                  return this.listener.call(
                    this.target,
                    arguments[0],
                    arguments[1],
                    arguments[2]
                  );
                default:
                  for (
                    var t = new Array(arguments.length), e = 0;
                    e < t.length;
                    ++e
                  )
                    t[e] = arguments[e];
                  this.listener.apply(this.target, t);
              }
          }
          function p(t, e, n) {
            var i = {
                fired: !1,
                wrapFn: void 0,
                target: t,
                type: e,
                listener: n,
              },
              r = x.call(h, i);
            return (r.listener = n), (i.wrapFn = r), r;
          }
          function f(t, e, n) {
            var i = t._events;
            if (!i) return [];
            var r = i[e];
            return r
              ? "function" == typeof r
                ? n
                  ? [r.listener || r]
                  : [r]
                : n
                ? m(r)
                : y(r, r.length)
              : [];
          }
          function d(t) {
            var e = this._events;
            if (e) {
              var n = e[t];
              if ("function" == typeof n) return 1;
              if (n) return n.length;
            }
            return 0;
          }
          function v(t, e) {
            for (var n = e, i = n + 1, r = t.length; i < r; n += 1, i += 1)
              t[n] = t[i];
            t.pop();
          }
          function y(t, e) {
            for (var n = new Array(e), i = 0; i < e; ++i) n[i] = t[i];
            return n;
          }
          function m(t) {
            for (var e = new Array(t.length), n = 0; n < e.length; ++n)
              e[n] = t[n].listener || t[n];
            return e;
          }
          function g(t) {
            var e = function () {};
            return (e.prototype = t), new e();
          }
          function _(t) {
            var e = [];
            for (var n in t)
              Object.prototype.hasOwnProperty.call(t, n) && e.push(n);
            return n;
          }
          function b(t) {
            var e = this;
            return function () {
              return e.apply(t, arguments);
            };
          }
          var E = Object.create || g,
            w = Object.keys || _,
            x = Function.prototype.bind || b;
          (e.exports = i),
            (i.EventEmitter = i),
            (i.prototype._events = void 0),
            (i.prototype._maxListeners = void 0);
          var L,
            O = 10;
          try {
            var k = {};
            Object.defineProperty &&
              Object.defineProperty(k, "x", { value: 0 }),
              (L = 0 === k.x);
          } catch (t) {
            L = !1;
          }
          L
            ? Object.defineProperty(i, "defaultMaxListeners", {
                enumerable: !0,
                get: function () {
                  return O;
                },
                set: function (t) {
                  if ("number" != typeof t || t < 0 || t !== t)
                    throw new TypeError(
                      '"defaultMaxListeners" must be a positive number'
                    );
                  O = t;
                },
              })
            : (i.defaultMaxListeners = O),
            (i.prototype.setMaxListeners = function (t) {
              if ("number" != typeof t || t < 0 || isNaN(t))
                throw new TypeError('"n" argument must be a positive number');
              return (this._maxListeners = t), this;
            }),
            (i.prototype.getMaxListeners = function () {
              return r(this);
            }),
            (i.prototype.emit = function (t) {
              var e,
                n,
                i,
                r,
                c,
                h,
                p = "error" === t;
              if ((h = this._events)) p = p && null == h.error;
              else if (!p) return !1;
              if (p) {
                if (
                  (arguments.length > 1 && (e = arguments[1]),
                  e instanceof Error)
                )
                  throw e;
                var f = new Error('Unhandled "error" event. (' + e + ")");
                throw ((f.context = e), f);
              }
              if (!(n = h[t])) return !1;
              var d = "function" == typeof n;
              switch ((i = arguments.length)) {
                case 1:
                  s(n, d, this);
                  break;
                case 2:
                  o(n, d, this, arguments[1]);
                  break;
                case 3:
                  a(n, d, this, arguments[1], arguments[2]);
                  break;
                case 4:
                  u(n, d, this, arguments[1], arguments[2], arguments[3]);
                  break;
                default:
                  for (r = new Array(i - 1), c = 1; c < i; c++)
                    r[c - 1] = arguments[c];
                  l(n, d, this, r);
              }
              return !0;
            }),
            (i.prototype.addListener = function (t, e) {
              return c(this, t, e, !1);
            }),
            (i.prototype.on = i.prototype.addListener),
            (i.prototype.prependListener = function (t, e) {
              return c(this, t, e, !0);
            }),
            (i.prototype.once = function (t, e) {
              if ("function" != typeof e)
                throw new TypeError('"listener" argument must be a function');
              return this.on(t, p(this, t, e)), this;
            }),
            (i.prototype.prependOnceListener = function (t, e) {
              if ("function" != typeof e)
                throw new TypeError('"listener" argument must be a function');
              return this.prependListener(t, p(this, t, e)), this;
            }),
            (i.prototype.removeListener = function (t, e) {
              var n, i, r, s, o;
              if ("function" != typeof e)
                throw new TypeError('"listener" argument must be a function');
              if (!(i = this._events)) return this;
              if (!(n = i[t])) return this;
              if (n === e || n.listener === e)
                0 == --this._eventsCount
                  ? (this._events = E(null))
                  : (delete i[t],
                    i.removeListener &&
                      this.emit("removeListener", t, n.listener || e));
              else if ("function" != typeof n) {
                for (r = -1, s = n.length - 1; s >= 0; s--)
                  if (n[s] === e || n[s].listener === e) {
                    (o = n[s].listener), (r = s);
                    break;
                  }
                if (r < 0) return this;
                0 === r ? n.shift() : v(n, r),
                  1 === n.length && (i[t] = n[0]),
                  i.removeListener && this.emit("removeListener", t, o || e);
              }
              return this;
            }),
            (i.prototype.removeAllListeners = function (t) {
              var e, n, i;
              if (!(n = this._events)) return this;
              if (!n.removeListener)
                return (
                  0 === arguments.length
                    ? ((this._events = E(null)), (this._eventsCount = 0))
                    : n[t] &&
                      (0 == --this._eventsCount
                        ? (this._events = E(null))
                        : delete n[t]),
                  this
                );
              if (0 === arguments.length) {
                var r,
                  s = w(n);
                for (i = 0; i < s.length; ++i)
                  "removeListener" !== (r = s[i]) && this.removeAllListeners(r);
                return (
                  this.removeAllListeners("removeListener"),
                  (this._events = E(null)),
                  (this._eventsCount = 0),
                  this
                );
              }
              if ("function" == typeof (e = n[t])) this.removeListener(t, e);
              else if (e)
                for (i = e.length - 1; i >= 0; i--)
                  this.removeListener(t, e[i]);
              return this;
            }),
            (i.prototype.listeners = function (t) {
              return f(this, t, !0);
            }),
            (i.prototype.rawListeners = function (t) {
              return f(this, t, !1);
            }),
            (i.listenerCount = function (t, e) {
              return "function" == typeof t.listenerCount
                ? t.listenerCount(e)
                : d.call(t, e);
            }),
            (i.prototype.listenerCount = d),
            (i.prototype.eventNames = function () {
              return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
            });
        },
        {},
      ],
      19: [
        function (t, e, n) {
          !(function () {
            var t = this,
              i = {};
            void 0 !== n ? (e.exports = i) : (t.fuzzy = i),
              (i.simpleFilter = function (t, e) {
                return e.filter(function (e) {
                  return i.test(t, e);
                });
              }),
              (i.test = function (t, e) {
                return null !== i.match(t, e);
              }),
              (i.match = function (t, e, n) {
                n = n || {};
                var i,
                  r = 0,
                  s = [],
                  o = e.length,
                  a = 0,
                  u = 0,
                  l = n.pre || "",
                  c = n.post || "",
                  h = (n.caseSensitive && e) || e.toLowerCase();
                t = (n.caseSensitive && t) || t.toLowerCase();
                for (var p = 0; p < o; p++)
                  (i = e[p]),
                    h[p] === t[r]
                      ? ((i = l + i + c), (r += 1), (u += 1 + u))
                      : (u = 0),
                    (a += u),
                    (s[s.length] = i);
                return r === t.length
                  ? ((a = h === t ? 1 / 0 : a),
                    { rendered: s.join(""), score: a })
                  : null;
              }),
              (i.filter = function (t, e, n) {
                return e && 0 !== e.length
                  ? "string" != typeof t
                    ? e
                    : ((n = n || {}),
                      e
                        .reduce(function (e, r, s, o) {
                          var a = r;
                          n.extract && (a = n.extract(r));
                          var u = i.match(t, a, n);
                          return (
                            null != u &&
                              (e[e.length] = {
                                string: u.rendered,
                                score: u.score,
                                index: s,
                                original: r,
                              }),
                            e
                          );
                        }, [])
                        .sort(function (t, e) {
                          var n = e.score - t.score;
                          return n || t.index - e.index;
                        }))
                  : [];
              });
          })();
        },
        {},
      ],
      20: [
        function (t, e, n) {
          "use strict";
          var i = Object.prototype.toString;
          e.exports = function (t) {
            var e;
            return (
              "[object Object]" === i.call(t) &&
              (null === (e = Object.getPrototypeOf(t)) ||
                e === Object.getPrototypeOf({}))
            );
          };
        },
        {},
      ],
      21: [
        function (t, e, n) {
          (function (t) {
            (function () {
              function n(t, e, n) {
                function r(e) {
                  var n = v,
                    i = y;
                  return (v = y = void 0), (L = e), (g = t.apply(i, n));
                }
                function s(t) {
                  return (L = t), (_ = setTimeout(c, e)), O ? r(t) : g;
                }
                function u(t) {
                  var n = t - x,
                    i = t - L,
                    r = e - n;
                  return k ? E(r, m - i) : r;
                }
                function l(t) {
                  var n = t - x,
                    i = t - L;
                  return void 0 === x || n >= e || n < 0 || (k && i >= m);
                }
                function c() {
                  var t = w();
                  if (l(t)) return h(t);
                  _ = setTimeout(c, u(t));
                }
                function h(t) {
                  return (_ = void 0), R && v ? r(t) : ((v = y = void 0), g);
                }
                function p() {
                  void 0 !== _ && clearTimeout(_),
                    (L = 0),
                    (v = x = y = _ = void 0);
                }
                function f() {
                  return void 0 === _ ? g : h(w());
                }
                function d() {
                  var t = w(),
                    n = l(t);
                  if (((v = arguments), (y = this), (x = t), n)) {
                    if (void 0 === _) return s(x);
                    if (k) return (_ = setTimeout(c, e)), r(x);
                  }
                  return void 0 === _ && (_ = setTimeout(c, e)), g;
                }
                var v,
                  y,
                  m,
                  g,
                  _,
                  x,
                  L = 0,
                  O = !1,
                  k = !1,
                  R = !0;
                if ("function" != typeof t) throw new TypeError(a);
                return (
                  (e = o(e) || 0),
                  i(n) &&
                    ((O = !!n.leading),
                    (k = "maxWait" in n),
                    (m = k ? b(o(n.maxWait) || 0, e) : m),
                    (R = "trailing" in n ? !!n.trailing : R)),
                  (d.cancel = p),
                  (d.flush = f),
                  d
                );
              }
              function i(t) {
                var e = typeof t;
                return !!t && ("object" == e || "function" == e);
              }
              function r(t) {
                return !!t && "object" == typeof t;
              }
              function s(t) {
                return "symbol" == typeof t || (r(t) && _.call(t) == l);
              }
              function o(t) {
                if ("number" == typeof t) return t;
                if (s(t)) return u;
                if (i(t)) {
                  var e = "function" == typeof t.valueOf ? t.valueOf() : t;
                  t = i(e) ? e + "" : e;
                }
                if ("string" != typeof t) return 0 === t ? t : +t;
                t = t.replace(c, "");
                var n = p.test(t);
                return n || f.test(t)
                  ? d(t.slice(2), n ? 2 : 8)
                  : h.test(t)
                  ? u
                  : +t;
              }
              var a = "Expected a function",
                u = NaN,
                l = "[object Symbol]",
                c = /^\s+|\s+$/g,
                h = /^[-+]0x[0-9a-f]+$/i,
                p = /^0b[01]+$/i,
                f = /^0o[0-7]+$/i,
                d = parseInt,
                v = "object" == typeof t && t && t.Object === Object && t,
                y =
                  "object" == typeof self &&
                  self &&
                  self.Object === Object &&
                  self,
                m = v || y || Function("return this")(),
                g = Object.prototype,
                _ = g.toString,
                b = Math.max,
                E = Math.min,
                w = function () {
                  return m.Date.now();
                };
              e.exports = n;
            }.call(this));
          }.call(
            this,
            "undefined" != typeof global
              ? global
              : "undefined" != typeof self
              ? self
              : "undefined" != typeof window
              ? window
              : {}
          ));
        },
        {},
      ],
      22: [
        function (t, e, n) {
          "use strict";
          var i = t("./src/suggestions");
          (e.exports = i),
            "undefined" != typeof window && (window.Suggestions = i);
        },
        { "./src/suggestions": 24 },
      ],
      23: [
        function (t, e, n) {
          "use strict";
          var i = function (t) {
            return (
              (this.component = t),
              (this.items = []),
              (this.active = 0),
              (this.wrapper = document.createElement("div")),
              (this.wrapper.className = "suggestions-wrapper"),
              (this.element = document.createElement("ul")),
              (this.element.className = "suggestions"),
              this.wrapper.appendChild(this.element),
              (this.selectingListItem = !1),
              t.el.parentNode.insertBefore(this.wrapper, t.el.nextSibling),
              this
            );
          };
          (i.prototype.show = function () {
            this.element.style.display = "block";
          }),
            (i.prototype.hide = function () {
              this.element.style.display = "none";
            }),
            (i.prototype.add = function (t) {
              this.items.push(t);
            }),
            (i.prototype.clear = function () {
              (this.items = []), (this.active = 0);
            }),
            (i.prototype.isEmpty = function () {
              return !this.items.length;
            }),
            (i.prototype.isVisible = function () {
              return "block" === this.element.style.display;
            }),
            (i.prototype.draw = function () {
              if (((this.element.innerHTML = ""), 0 === this.items.length))
                return void this.hide();
              for (var t = 0; t < this.items.length; t++)
                this.drawItem(this.items[t], this.active === t);
              this.show();
            }),
            (i.prototype.drawItem = function (t, e) {
              var n = document.createElement("li"),
                i = document.createElement("a");
              e && (n.className += " active"),
                (i.innerHTML = t.string),
                n.appendChild(i),
                this.element.appendChild(n),
                n.addEventListener(
                  "mousedown",
                  function () {
                    this.selectingListItem = !0;
                  }.bind(this)
                ),
                n.addEventListener(
                  "mouseup",
                  function () {
                    this.handleMouseUp.call(this, t);
                  }.bind(this)
                );
            }),
            (i.prototype.handleMouseUp = function (t) {
              (this.selectingListItem = !1),
                this.component.value(t.original),
                this.clear(),
                this.draw();
            }),
            (i.prototype.move = function (t) {
              (this.active = t), this.draw();
            }),
            (i.prototype.previous = function () {
              this.move(
                0 === this.active ? this.items.length - 1 : this.active - 1
              );
            }),
            (i.prototype.next = function () {
              this.move(
                this.active === this.items.length - 1 ? 0 : this.active + 1
              );
            }),
            (i.prototype.drawError = function (t) {
              var e = document.createElement("li");
              (e.innerHTML = t), this.element.appendChild(e), this.show();
            }),
            (e.exports = i);
        },
        {},
      ],
      24: [
        function (t, e, n) {
          "use strict";
          var i = t("xtend"),
            r = t("fuzzy"),
            s = t("./list"),
            o = function (t, e, n) {
              return (
                (n = n || {}),
                (this.options = i(
                  { minLength: 2, limit: 5, filter: !0, hideOnBlur: !0 },
                  n
                )),
                (this.el = t),
                (this.data = e || []),
                (this.list = new s(this)),
                (this.query = ""),
                (this.selected = null),
                this.list.draw(),
                this.el.addEventListener(
                  "keyup",
                  function (t) {
                    this.handleKeyUp(t.keyCode);
                  }.bind(this),
                  !1
                ),
                this.el.addEventListener(
                  "keydown",
                  function (t) {
                    this.handleKeyDown(t);
                  }.bind(this)
                ),
                this.el.addEventListener(
                  "focus",
                  function () {
                    this.handleFocus();
                  }.bind(this)
                ),
                this.el.addEventListener(
                  "blur",
                  function () {
                    this.handleBlur();
                  }.bind(this)
                ),
                this.el.addEventListener(
                  "paste",
                  function (t) {
                    this.handlePaste(t);
                  }.bind(this)
                ),
                (this.render = this.options.render
                  ? this.options.render.bind(this)
                  : this.render.bind(this)),
                (this.getItemValue = this.options.getItemValue
                  ? this.options.getItemValue.bind(this)
                  : this.getItemValue.bind(this)),
                this
              );
            };
          (o.prototype.handleKeyUp = function (t) {
            40 !== t &&
              38 !== t &&
              27 !== t &&
              13 !== t &&
              9 !== t &&
              this.handleInputChange(this.el.value);
          }),
            (o.prototype.handleKeyDown = function (t) {
              switch (t.keyCode) {
                case 13:
                case 9:
                  this.list.isEmpty() ||
                    (this.list.isVisible() && t.preventDefault(),
                    this.value(this.list.items[this.list.active].original),
                    this.list.hide());
                  break;
                case 27:
                  this.list.isEmpty() || this.list.hide();
                  break;
                case 38:
                  this.list.previous();
                  break;
                case 40:
                  this.list.next();
              }
            }),
            (o.prototype.handleBlur = function () {
              !this.list.selectingListItem &&
                this.options.hideOnBlur &&
                this.list.hide();
            }),
            (o.prototype.handlePaste = function (t) {
              if (t.clipboardData)
                this.handleInputChange(t.clipboardData.getData("Text"));
              else {
                var e = this;
                setTimeout(function () {
                  e.handleInputChange(t.target.value);
                }, 100);
              }
            }),
            (o.prototype.handleInputChange = function (t) {
              if (
                ((this.query = this.normalize(t)),
                this.list.clear(),
                this.query.length < this.options.minLength)
              )
                return void this.list.draw();
              this.getCandidates(
                function (t) {
                  for (
                    var e = 0;
                    e < t.length &&
                    (this.list.add(t[e]), e !== this.options.limit - 1);
                    e++
                  );
                  this.list.draw();
                }.bind(this)
              );
            }),
            (o.prototype.handleFocus = function () {
              this.list.isEmpty() || this.list.show(),
                (this.list.selectingListItem = !1);
            }),
            (o.prototype.update = function (t) {
              (this.data = t), this.handleKeyUp();
            }),
            (o.prototype.clear = function () {
              (this.data = []), this.list.clear();
            }),
            (o.prototype.normalize = function (t) {
              return (t = t.toLowerCase());
            }),
            (o.prototype.match = function (t, e) {
              return t.indexOf(e) > -1;
            }),
            (o.prototype.value = function (t) {
              if (
                ((this.selected = t),
                (this.el.value = this.getItemValue(t)),
                document.createEvent)
              ) {
                var e = document.createEvent("HTMLEvents");
                e.initEvent("change", !0, !1), this.el.dispatchEvent(e);
              } else this.el.fireEvent("onchange");
            }),
            (o.prototype.getCandidates = function (t) {
              var e,
                n = {
                  pre: "<strong>",
                  post: "</strong>",
                  extract: function (t) {
                    return this.getItemValue(t);
                  }.bind(this),
                };
              this.options.filter
                ? ((e = r.filter(this.query, this.data, n)),
                  (e = e.map(
                    function (t) {
                      return {
                        original: t.original,
                        string: this.render(t.original, t.string),
                      };
                    }.bind(this)
                  )))
                : (e = this.data.map(
                    function (t) {
                      return { original: t, string: this.render(t) };
                    }.bind(this)
                  )),
                t(e);
            }),
            (o.prototype.getItemValue = function (t) {
              return t;
            }),
            (o.prototype.render = function (t, e) {
              if (e) return e;
              for (
                var n = t.original
                    ? this.getItemValue(t.original)
                    : this.getItemValue(t),
                  i = this.normalize(n),
                  r = i.lastIndexOf(this.query);
                r > -1;

              ) {
                var s = r + this.query.length;
                (n =
                  n.slice(0, r) +
                  "<strong>" +
                  n.slice(r, s) +
                  "</strong>" +
                  n.slice(s)),
                  (r = i.slice(0, r).lastIndexOf(this.query));
              }
              return n;
            }),
            (o.prototype.renderError = function (t) {
              this.list.drawError(t);
            }),
            (e.exports = o);
        },
        { "./list": 23, fuzzy: 19, xtend: 25 },
      ],
      25: [
        function (t, e, n) {
          function i() {
            for (var t = {}, e = 0; e < arguments.length; e++) {
              var n = arguments[e];
              for (var i in n) r.call(n, i) && (t[i] = n[i]);
            }
            return t;
          }
          e.exports = i;
          var r = Object.prototype.hasOwnProperty;
        },
        {},
      ],
    },
    {},
    [1]
  )(1);
});
