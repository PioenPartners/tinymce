/*!
 * Tiny Merge Tags plugin
 *
 * Copyright (c) 2023 Ephox Corporation DBA Tiny Technologies, Inc.
 * Licensed under the Tiny commercial license. See https://www.tiny.cloud/legal/
 *
 * Version: 1.3.0-53
 */

!function() {
    "use strict";
    const e = e=>t=>(e=>{
        const t = typeof e;
        return null === e ? "null" : "object" === t && Array.isArray(e) ? "array" : "object" === t && (n = r = e,
        (o = String).prototype.isPrototypeOf(n) || (null === (a = r.constructor) || void 0 === a ? void 0 : a.name) === o.name) ? "string" : t;
        var n, r, o, a
    }
    )(t) === e
      , t = e("string")
      , n = e("object")
      , r = e("array")
      , o = e=>!(e=>null == e)(e)
      , a = e=>"function" == typeof e;
    class s {
        constructor(e, t) {
            this.tag = e,
            this.value = t
        }
        static some(e) {
            return new s(!0,e)
        }
        static none() {
            return s.singletonNone
        }
        fold(e, t) {
            return this.tag ? t(this.value) : e()
        }
        isSome() {
            return this.tag
        }
        isNone() {
            return !this.tag
        }
        map(e) {
            return this.tag ? s.some(e(this.value)) : s.none()
        }
        bind(e) {
            return this.tag ? e(this.value) : s.none()
        }
        exists(e) {
            return this.tag && e(this.value)
        }
        forall(e) {
            return !this.tag || e(this.value)
        }
        filter(e) {
            return !this.tag || e(this.value) ? this : s.none()
        }
        getOr(e) {
            return this.tag ? this.value : e
        }
        or(e) {
            return this.tag ? this : e
        }
        getOrThunk(e) {
            return this.tag ? this.value : e()
        }
        orThunk(e) {
            return this.tag ? this : e()
        }
        getOrDie(e) {
            if (this.tag)
                return this.value;
            throw new Error(null != e ? e : "Called getOrDie on None")
        }
        static from(e) {
            return o(e) ? s.some(e) : s.none()
        }
        getOrNull() {
            return this.tag ? this.value : null
        }
        getOrUndefined() {
            return this.value
        }
        each(e) {
            this.tag && e(this.value)
        }
        toArray() {
            return this.tag ? [this.value] : []
        }
        toString() {
            return this.tag ? `some(${this.value})` : "none()"
        }
    }
    s.singletonNone = new s(!1);
    const i = e=>parseInt(e, 10)
      , l = (e,t)=>{
        const n = e - t;
        return 0 === n ? 0 : n > 0 ? 1 : -1
    }
      , u = (e,t,n)=>({
        major: e,
        minor: t,
        patch: n
    })
      , c = e=>{
        const t = /([0-9]+)\.([0-9]+)\.([0-9]+)(?:(\-.+)?)/.exec(e);
        return t ? u(i(t[1]), i(t[2]), i(t[3])) : u(0, 0, 0)
    }
      , g = Array.prototype.slice
      , h = Array.prototype.push
      , m = (e,t)=>{
        const n = e.length
          , r = new Array(n);
        for (let o = 0; o < n; o++) {
            const n = e[o];
            r[o] = t(n, o)
        }
        return r
    }
      , d = (e,t)=>{
        for (let n = 0, r = e.length; n < r; n++)
            t(e[n], n)
    }
      , p = e=>{
        const t = [];
        for (let n = 0, o = e.length; n < o; ++n) {
            if (!r(e[n]))
                throw new Error("Arr.flatten item " + n + " was not an array, input: " + e);
            h.apply(t, e[n])
        }
        return t
    }
      , f = (e,t)=>p(m(e, t))
      , v = (e,t)=>{
        for (let n = 0, r = e.length; n < r; ++n)
            if (!0 !== t(e[n], n))
                return !1;
        return !0
    }
      , y = Object.hasOwnProperty
      , b = (e,t)=>y.call(e, t)
      , w = e=>b(e, "value") && t(e.value) && e.value.length > 0
      , x = e=>b(e, "title") && t(e.title) && e.title.length > 0 && b(e, "menu") && r(e.menu) && e.menu.length > 0 && v(e.menu, N)
      , N = e=>n(e) && (w(e) || x(e))
      , C = e=>{
        var t;
        if (r(t = e) && t.length > 0 && v(t, N)) {
            const t = (e=>{
                const t = (e,n)=>{
                    if (0 === e.length)
                        return n;
                    const [r,...o] = e;
                    if (w(r))
                        return r.value.length > 255 ? t(o, n) : t(o, [...n, r]);
                    {
                        const e = t(r.menu, []);
                        return t(o, e.length > 0 ? [...n, {
                            ...r,
                            menu: e
                        }] : n)
                    }
                }
                ;
                return t(e, [])
            }
            )(e);
            return t.length > 0 ? {
                valid: !0,
                value: t
            } : {
                valid: !1,
                message: "Merge tag list should not contain values with more than 255 characters"
            }
        }
        return {
            valid: !1,
            message: "Must be a non-empty array of objects matching the configuration schema: https://www.tiny.cloud/docs/tinymce/6/mergetags/"
        }
    }
      , _ = e=>t=>t.options.get(e)
      , T = _("mergetags_prefix")
      , O = _("mergetags_suffix")
      , j = _("mergetags_list")
      , A = "data-mce-mergetag"
      , E = "data-mce-mergetag-affix"
      , M = "mce-mergetag-affix"
      , S = (e,t,n)=>{
        const r = tinymce.html.Node.create("span", {
            class: "mce-mergetag",
            contenteditable: "false",
            "data-mce-cef-wrappable": "true",
            [A]: "1"
        })
          , o = tinymce.html.Node.create("span", {
            class: M,
            [E]: ""
        })
          , a = tinymce.html.Node.create("#text");
        a.value = t,
        o.append(a);
        const s = tinymce.html.Node.create("span", {
            class: M,
            [E]: ""
        })
          , i = tinymce.html.Node.create("#text");
        i.value = n,
        s.append(i);
        const l = tinymce.html.Node.create("#text");
        return l.value = e,
        r.append(o),
        r.append(l),
        r.append(s),
        r
    }
      , k = (e,t,n)=>tinymce.html.Serializer().serialize(S(e, t, n))
      , I = (e,t)=>{
        const n = [];
        for (let r = e.indexOf(t); -1 !== r; r = e.indexOf(t, r + t.length))
            n.push(r);
        return n
    }
      , P = (e,t,n)=>((e,t,n,r=255)=>{
        let o = []
          , a = [];
        if (t === n) {
            const n = I(e, t);
            if (n.length < 2)
                return s.none();
            d(n, ((e,t)=>(t % 2 == 0 ? o : a).push(e)))
        } else {
            if (o = I(e, t),
            0 === o.length)
                return s.none();
            if (a = I(e, n),
            0 === a.length)
                return s.none()
        }
        const i = m(o, (e=>[e, -1]))
          , l = t.length;
        for (let e = a.length - 1; e >= 0; e--) {
            const t = a[e];
            for (let e = o.length - 1; e >= 0; e--) {
                const n = o[e] + l;
                if (t > n) {
                    t <= n + r && (i[e][1] = t);
                    break
                }
            }
        }
        const u = ((e,t)=>{
            const n = [];
            for (let t = 0, r = e.length; t < r; t++) {
                const r = e[t];
                -1 !== r[1] && n.push(r)
            }
            return n
        }
        )(i)
          , c = m(u, (([e,t])=>[e, t + n.length]));
        return g = c,
        c.length > 0 ? s.some(g) : s.none();
        var g
    }
    )(e, t, n).map((r=>m(((e,t)=>{
        const n = p(e);
        let r = !1;
        0 === n[0] ? r = !0 : n.unshift(0),
        n[n.length - 1] !== t && n.push(t);
        const o = [];
        for (let e = 0; e < n.length - 1; e++)
            n[e] !== n[e + 1] && o.push({
                isTag: r,
                indexes: [n[e], n[e + 1]]
            }),
            r = !r;
        return o
    }
    )(r, e.length), (({isTag: r, indexes: [o,a]})=>r ? {
        isTag: r,
        content: e.substring(o + t.length, a - n.length)
    } : {
        isTag: r,
        content: e.substring(o, a)
    }))))
      , L = e=>d(e, (e=>e.unwrap()))
      , R = e=>{
        if (null == e)
            throw new Error("Node cannot be null or undefined");
        return {
            dom: e
        }
    }
      , z = R;
    "undefined" != typeof window ? window : Function("return this;")();
    const F = e=>t=>(e=>e.dom.nodeType)(t) === e
      , $ = F(1)
      , B = F(9)
      , D = F(11)
      , q = e=>B(e) ? e : z(e.dom.ownerDocument)
      , H = a(Element.prototype.attachShadow) && a(Node.prototype.getRootNode) ? e=>z(e.dom.getRootNode()) : q
      , U = e=>e.dom.blur()
      , V = e=>{
        const t = (e=>(e=>D(e) && o(e.dom.host))(e) ? e : z(q(e).dom.body))(H(z(e.getElement())));
        var n;
        (n = t,
        ((e=(()=>z(document))())=>s.from(e.dom.activeElement).map(z))(H(n)).filter((e=>n.dom.contains(e.dom)))).filter(("input",
        e=>$(e) && "input" === e.dom.nodeName.toLowerCase())).each(U)
    }
      , G = e=>t(e.title) && e.title.length > 0 ? e.title : e.value;
    function K(e, t) {
        const n = T(e)
          , r = O(e)
          , o = t=>m(t, (t=>(t=>x(t) ? {
            type: "nestedmenuitem",
            text: t.title,
            getSubmenuItems: ()=>o(t.menu)
        } : {
            type: "menuitem",
            text: G(t),
            value: t.value,
            onAction: ()=>{
                return o = t.value,
                V(e),
                void e.insertContent(k(o, n, r));
                var o
            }
        })(t)));
        return o(t)
    }
    const W = (e,t)=>{
        if (0 === t.length)
            return e;
        {
            const n = t.toLowerCase()
              , r = f(e, (e=>{
                const t = ((e,t,n)=>{
                    const r = e.toLowerCase().indexOf(n)
                      , o = t.toLowerCase().indexOf(n)
                      , a = r > -1
                      , s = o > -1;
                    return a && s ? Math.min(r, o) : a ? r : s ? o : -1
                }
                )(e.text, e.value, n);
                return t >= 0 ? [{
                    item: e,
                    index: t
                }] : []
            }
            ))
              , o = ((e,t)=>{
                const n = g.call(e, 0);
                return n.sort(((e,t)=>e.index - t.index)),
                n
            }
            )(r);
            return m(o, (({item: e})=>e))
        }
    }
      , J = e=>{
        const t = (e,n)=>((e,n,r)=>(d(e, ((e,n)=>{
            var o, a;
            o = r,
            r = x(a = e) ? t(a.menu, o) : [...o, a]
        }
        )),
        r))(e, 0, n);
        return t(e, [])
    }
    ;
    tinymce.PluginManager.requireLangPack("mergetags", "ar,bg_BG,ca,cs,da,de,el,es,eu,fa,fi,fr_FR,he_IL,hi,hr,hu_HU,id,it,ja,kk,ko_KR,ms,nb_NO,nl,pl,pt_BR,pt_PT,ro,ru,sk,sl_SI,sv_SE,th_TH,tr,uk,vi,zh_CN,zh_TW"),
    tinymce.PluginManager.add("mergetags", (e=>{
        ((e,t)=>!!e && -1 === ((e,t)=>{
            const n = l(e.major, t.major);
            if (0 !== n)
                return n;
            const r = l(e.minor, t.minor);
            if (0 !== r)
                return r;
            const o = l(e.patch, t.patch);
            return 0 !== o ? o : 0
        }
        )((e=>c((e=>[e.majorVersion, e.minorVersion].join(".").split(".").slice(0, 3).join("."))(e)))(e), c(t)))(tinymce, "6.4.0") ? console.error("The mergetags plugin requires at least version 6.4.0 of TinyMCE.") : ((e=>{
            const t = e.options.register;
            t("mergetags_list", {
                processor: C
            }),
            t("mergetags_prefix", {
                processor: "string",
                default: "{{"
            }),
            t("mergetags_suffix", {
                processor: "string",
                default: "}}"
            })
        }
        )(e),
        (e=>{
            const t = T(e)
              , n = O(e);
            e.addCommand("mceMergeTag", ((r,o)=>{
                ((e,t,n)=>{
                    const r = e.selection.getContent({
                        format: "text"
                    });
                    r.length > 0 && r.length <= 255 ? e.insertContent(k(r, t, n)) : r.length > 255 && (e.insertContent(`${t}${r}${n}`),
                    console.error("Merge tag content should not contain more than 255 characters"))
                }
                )(e, t, n),
                e.execCommand("mceAutocompleterClose")
            }
            ))
        }
        )(e),
        (e=>{
            e.on("PreInit", (()=>{
                const {serializer: n, parser: r} = e
                  , o = T(e)
                  , a = O(e);
                r.addNodeFilter("#text", ((e,n)=>r=>{
                    const o = e.length + n.length
                      , a = f(r, (r=>s.from(r.value).filter((e=>e.length > o && !(e=>{
                        let n = e;
                        for (; n = n.parent; ) {
                            const e = n.attr("contenteditable");
                            if (t(e))
                                return "false" === e
                        }
                        return !1
                    }
                    )(r))).map((t=>({
                        node: r,
                        fragments: P(t, e, n)
                    }))).toArray()));
                    d(a, (({node: t, fragments: r})=>{
                        const o = tinymce.html.Node.create("span");
                        r.each((r=>{
                            d(r, (({isTag: t, content: r})=>{
                                if (t)
                                    o.append(S(r, e, n));
                                else {
                                    const e = tinymce.html.Node.create("#text");
                                    e.value = r,
                                    o.append(e)
                                }
                            }
                            )),
                            t.replace(o),
                            o.unwrap()
                        }
                        ))
                    }
                    ))
                }
                )(o, a)),
                n.addAttributeFilter([A, E].join(","), L)
            }
            ))
        }
        )(e),
        s.from(j(e)).fold((()=>{
            console.warn("No entries added to the mergetags_list option yet. The toolbar button and menu item for the mergetags plugin will be hidden.")
        }
        ), (t=>{
            ((e,t)=>{
                const n = T(e)
                  , r = O(e)
                  , o = J(t)
                  , a = m(o, (e=>({
                    text: G(e),
                    ...e
                })));
                e.ui.registry.addAutocompleter("mergetags", {
                    trigger: n,
                    minChars: 0,
                    columns: 1,
                    fetch: e=>Promise.resolve(W(a, e)),
                    onAction: (t,o,a)=>{
                        e.selection.setRng(o),
                        e.insertContent(k(a, n, r)),
                        t.hide()
                    }
                })
            }
            )(e, t),
            ((e,t)=>{
                const n = K(e, t)
                  , r = ((e,t)=>K(e, J(t)))(e, t);
                e.ui.registry.addMenuButton("mergetags", {
                    tooltip: "Insert merge tag",
                    icon: "addtag",
                    onSetup: t=>{
                        const n = ()=>{
                            t.setEnabled(e.selection.isEditable())
                        }
                        ;
                        return e.on("NodeChange", n),
                        n(),
                        ()=>{
                            e.off("NodeChange", n)
                        }
                    }
                    ,
                    search: {
                        placeholder: "Filter merge tags"
                    },
                    fetch: (e,t)=>{
                        t.pattern.length > 0 ? e((e=>{
                            const t = W(r, e);
                            return t.length > 0 ? t : [{
                                type: "menuitem",
                                value: "stub",
                                text: "No matches",
                                enabled: !1
                            }]
                        }
                        )(t.pattern)) : e(n)
                    }
                })
            }
            )(e, t),
            ((e,t)=>{
                const n = K(e, t);
                var r;
                e.ui.registry.addNestedMenuItem("mergetags", {
                    text: "Merge tag",
                    icon: "addtag",
                    onSetup: t=>{
                        const n = ()=>{
                            t.setEnabled(e.selection.isEditable())
                        }
                        ;
                        return e.on("NodeChange", n),
                        n(),
                        ()=>{
                            e.off("NodeChange", n)
                        }
                    }
                    ,
                    getSubmenuItems: (r = n,
                    ()=>r)
                })
            }
            )(e, t)
        }
        )))
    }
    ))
}();
