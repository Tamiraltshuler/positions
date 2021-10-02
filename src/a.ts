function setViewData(e: any, t: any) {
    var n = this.currentMode, i = this.modes;
    if (t) {
        for (var r in this.scroll = null, i)
            i.hasOwnProperty(r) && i[r].set(e, !0);
        var o = this.app.foldManager.load(this.file);
        o && n.applyFoldInfo(o)
    } else n.set(e, !1)
}