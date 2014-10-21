!function (e, t) {
	"use strict";

	$.fn.dataset = function (e, t) {
		var i = "data-" + e;
		return void 0 === t ? this.attr(i) : null === t ? this.removeAttr(i) : this.attr(i, t)
	},

	Array.prototype.indexOf || (Array.prototype.indexOf = function (e, t) {
		return $.inArray(e, this, t)
	}),

	Function.prototype.bind || (Function.prototype.bind = function (e) {
		return $.proxy(this, e)
	}),

	e.lc || (e.lc = {}),

	lc.App = {
		cdn: "http://cdn.lezhin.com",
		can: {
			draggable: "draggable" in t.createElement("span")
		},

		init: function () {
			$("#main-signup").on("click", function (e) {
				e.preventDefault(), lc.Misc.trackAdeCorp(2, function () {
					location.href = "/signup"
				})
			}),

			$("#viewer-signup").on("click", function (e) {
				e.preventDefault(),
				lc.Misc.trackAdeCorp(6, function () {
					location.href = "/signup"
				})
			}),

			$("#ask-serial").on("click", function (e) {
				e.preventDefault(),
				lc.Popup.open("#popup-ask-serial")
			})
	}}, lc.HotKey = {map: {16: "shift", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home", 37: "left", 39: "right"}, special: ["shift"], hold: {shift: !1}, getKey: function (e) {
		var t = this.map[e.which];
		if (t)
			return this.isSpecial(t) && (lc.HotKey.hold[t] = !0), t
	}, isSpecial: function (e) {
		return this.special.indexOf(e) >= 0
	}, bindKeyUp: function () {
		$(t).on("keyup", function (e) {
			var t = lc.HotKey, i = t.getKey(e);
			i && t.isSpecial && (t.hold[i] = !1)
		})
	}}, lc.Regex = {email: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/, birthday: /\d{6}/}, lc.Util = {pad: function (e, t) {
		var i = "0000000000" + e;
		return i.slice(i.length - (t || 2))
	}, titleize: function (e) {
		return e.charAt(0).toUpperCase() + e.slice(1)
	}, camelize: function (e) {
		var t = lc.Util.capitalize(e);
		return t.charAt(0).toLowerCase() + t.slice(1)
	}, capitalize: function (e) {
		for (var t = e.split(/[-_]/), i = [], a = 0, s = t.length; s > a; ++a)
			i.push(lc.Util.titleize(t[a]));
		return i.join("")
	}, commaize: function (e) {
		return e = e || 0, e.toString().replace(/\d(?=(\d{3})+$)/g, "$&,")
	}, escape: function (e) {
		return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
	}, template: function (e, t) {
		var i = e;
		for (var a in t)
			i = i.split("{{" + a + "}}").join(t[a]);
		return i
	}, formatDate: function (e, t) {
		var i = typeof e;
		"undefined" == i ? e = new Date : "string" == i && (e = new Date(e.replace(/-/g, "/")));
		var a = e.getFullYear().toString(), s = e.getMonth() + 1, o = e.getDate(), n = e.getHours(), c = e.getMinutes(), r = e.getSeconds();
		return t = t || "yyyy/mm/dd", t.replace(/yyyy/gi, a).replace(/yy/gi, lc.Util.pad(a.substr(-2))).replace(/mm/g, lc.Util.pad(s)).replace(/dd/gi, lc.Util.pad(o)).replace(/hh/gi, lc.Util.pad(n)).replace(/MM/g, lc.Util.pad(c)).replace(/ss/gi, lc.Util.pad(r))
	}, existFinalConsonant: function (e) {
		return (e.charCodeAt(e.length - 1) - 44032) % 28 != 0
	}}, lc.User = {init: function (e) {
		var t = {coin: {android: 0, ios: 0, web: 0}, point: {android: 0, ios: 0, web: 0}};
		$.extend(!0, t, e), $.extend(!0, this, t), this.coin.total = this.coin.android + this.coin.ios + this.coin.web, this.point.total = this.point.android + this.point.ios + this.point.web
	}}, lc.Episode = {init: function (e) {
		$.extend(!0, this, e), this.all.sort(function (e, t) {
			return e.seq - t.seq
		});
		var t = {};
		this.regular = [], this.special = [];
		for (var i = 0, a = this.all.length; a > i; ++i) {
			var s = this.all[i], o = s.episodeId;
			s.purchased = this.isPurchased(o), s.viewed = this.isViewed(o), s.name.match(/^x/) && (s.type = "x"), s.title = lc.Util.escape(s.title), "s" == s.type ? this.special.push(s) : this.regular.push(s), !t.crossViewer && s.cut > 0 && s.page > 0 && (t.crossViewer = !0), !t.bgm && s.bgm && s.bgm.file && (t.bgm = !0)
		}
		this.comic.support = t, this.initHandler()
	}, initHandler: function () {
		$("#popup-purchase").find("[data-action=ok]").on("click", function () {
			var e = $(this).dataset("episode-id"), t = lc.Episode.findEpisode(e);
			if (t) {
				var i = lc.Episode.comic, a = {comicId: i.comicId, departure: i.departure, episodeId: e, coin: t.coin, point: t.point};
				lc.Episode.requestPurchase(a)
			}
		})
	}, requestPurchase: function (e) {
		var t = $.ajax({data: e, type: "post", url: "/purchase"});
		t.done(function (t) {
			var i = t.result, a = e.episodeId;
			if (lc.Popup.close(), "SUCCESS" == i) {
				var s = $("#purchased");
				s.val(s.val() + "|" + a);
				var o = "/" + (e.departure || "comic") + "/" + a;
				location.href = o
			} else
				lc.Notification.show("error", "에피소드를 구입하지 못 했습니다.")
		}), t.fail(function () {
			lc.Popup.close(), lc.Notification.show("error", "에피소드를 구입하지 못 했습니다.")
		})
	}, findEpisode: function (e) {
		for (var t = this.all, i = 0, a = t.length; a > i; ++i) {
			var s = t[i];
			if (s.episodeId === e)
				return s
		}
	}, findFirstEpisode: function (e) {
		return this[e || "regular"][0]
	}, findLastViewedEpisode: function (e) {
		for (var t = this[e || "regular"], i = t.length - 1; i >= 0; --i) {
			var a = t[i];
			if (a.viewed)
				return a
		}
	}, findContinuousEpisode: function (e) {
		var t = this[e || "regular"], i = this.findLastViewedEpisode(e);
		if (i) {
			var a = t.indexOf(i);
			if (a != t.length)
				return t[a + 1]
		}
	}, findPrevEpisode: function (e) {
		var t = this["s" == e.type ? "special" : "regular"], i = t.indexOf(e);
		return 0 != i ? t[i - 1] : void 0
	}, findNextEpisode: function (e) {
		var t = this["s" == e.type ? "special" : "regular"], i = t.indexOf(e);
		return i != t.length ? t[i + 1] : void 0
	}, isPurchased: function (e) {
		return this.purchased.indexOf(e) >= 0
	}, isViewed: function (e) {
		return this.viewed.indexOf(e) >= 0
	}, canPurchase: function (e, t) {
		var i = this.comic;
		return e.purchased || !lc.User.userId ? !1 : "guide" == i.comicId || "p" == e.type ? t : i.adult && !lc.User.adult ? !1 : e.free && !t ? !1 : e.point && e.point > lc.User.point.total ? !1 : e.coin > lc.User.coin.total ? !1 : !0
	}, checkPermission: function (e, t) {
		var i = lc.Episode.findEpisode(e);
		this.canPurchase(i, t) ? this.purchaseEpisode(i) : this.moveToViewer(i)
	}, moveToViewer: function (e) {
		var t = e.episodeId;
		if (lc.Episode.viewed.indexOf(t) < 0) {
			var i = $("#viewed");
			i.val(i.val() + "|" + t)
		}
		var a = lc.Episode.comic.departure || "comic";
		location.href = "/" + a + "/" + t
	}, purchaseEpisode: function (e) {
		var t = $("#popup-purchase"), i = e.coin, a = e.point, s = e.displayName, o = e.type ? s : s.replace(/^0+/, "") + "화";
		o += lc.Util.existFinalConsonant(o) ? "을" : "를";
		var n = (a ? a + "포인트를" : i + "코인을") + " 사용해서 ";
		n += o + " 보시겠습니까?<br>구매한 만화는 내 서재에 소장됩니다.", t.find(".popup-message").html(n), t.find("[data-action=ok]").dataset("episode-id", e.episodeId), lc.Popup.open("#popup-purchase")
	}}, lc.Template = {episode: function (e, t, i) {
		var a = $("#" + e + "-template").html();
		t.empty();
		for (var s = 0, o = i.length; o > s; ++s) {
			var n = i[s], c = (n.episodeId, n.title, n.free), r = n.coin, d = n.point, l = n.dDay, p = n.purchased, h = n.viewed, u = n.freeDate, g = n.publishDate;
			n.up && (n.title += '<img class="up" src="' + lc.App.cdn + '/img/comic/up.png">');
			var f;
			f = p ? "소장중" : c ? "무료" : r ? r + " 코인" : d ? d + " 포인트" : "0 코인", u ? u = lc.Util.formatDate(u, "yy.mm.dd") : g && (u = lc.Util.formatDate(g, "yy.mm.dd"));
			var v = p || c ? !1 : !0, m = $.extend(n, {dDay: l ? "D - " + l : "", freeDate: u, locked: v, priceText: f, purchased: p, viewed: h}), w = $(lc.Util.template(a, m));
			v && !l && w.find(".d-day").remove(), t.append(w)
		}
		return t
	}}, lc.Popup = {init: function () {
		$(".popup").filter("[data-event]").each(function () {
			var e = $(this), t = e.closest(".popup"), i = t.attr("id"), a = t.dataset("event-from"), s = t.dataset("event-to"), o = (new Date).getTime();
			o > a && s > o && !store.get(i) && lc.Popup.open("#" + i)
		}), $(".popup-close").on("click", function (e) {
			e.stopPropagation(), lc.Popup.close()
		}), $(".popup").on("click", "[data-action]", function (e) {
			e.stopPropagation();
			var t = $(this), i = t.dataset("action");
			if ("forget" == i || "link" == i) {
				var a = t.closest(".popup").attr("id");
				store.set(a, !0), "link" == i && (location.href = t.dataset("url"))
			}
			lc.Popup.close()
		})
	}, open: function (e) {
		var t = $("#overlay"), i = $(e);
		t.append(i), t.fadeIn()
	}, close: function () {
		var e = $("#overlay");
		e.fadeOut(function () {
			var t = e.find(".popup");
			t.appendTo("body")
		})
	}}, lc.Popup.init(), lc.Notification = {show: function (e, i, a) {
		var s = {className: "notification", delay: 3e3, height: 50};
		a = $.extend(s, a);
		var o = $("<div/>").addClass(a.className).appendTo(t.body), n = $("." + a.className).length;
		o.html(i).dataset("level", e).animate({top: (n - 1) * a.height}).delay(3e3).animate({top: -a.height}, {complete: function () {
			$(this).remove()
		}})
	}}, lc.Facebook = {init: function () {
		$("[data-action=share-facebook]").on("click", function () {
			var t = encodeURIComponent(location.href.replace("/library/", "/comic/")), i = lc.Viewer.rid;
			i && (t += "?rid=" + i), e.open("https://www.facebook.com/sharer/sharer.php?u=" + t, "_blank", "width=626,height=436")
		})
	}}, lc.Facebook.init(), lc.Twitter = {init: function () {
		$("[data-action=share-twitter]").on("click", function () {
			var t = encodeURIComponent(lc.Episode.comic.title + "/" + lc.Viewer.episode.title + " - 레진코믹스"), i = encodeURIComponent(location.href.replace("/library/", "/comic/")), a = lc.Viewer.rid;
			a && (i += "?rid=" + a), e.open("https://twitter.com/share?text=" + t + "&url=" + i, "_blank", "width=575,height=400")
		})
	}}, lc.Twitter.init(), lc.Viewer = {init: function (e) {
		var t = {direction: "ttb", preload: 2, retain: 5, size: "fit-width"};
		$.extend(this, $.extend(t, e)), this.episode = lc.Episode.findEpisode(this.episodeId), this.direction = this.direction.toLowerCase(), this.cutIndex = 1, this.loadIndex = 0, this.initSettings(), this.initElements(), this.initHandlers(), this.setupNearEpisode(), this.loadFirstCut(), this.initBgm()
	}, initSettings: function () {
		var e = this.episode, t = e.direction || "ttb";
		this.cuts = e.cut, this.pages = e.page, this.isCrossView = e.cut && e.page, this.direction = t, "ttb" != t && (this.sides = store.get("viewer-page-side") || 2, this.isCrossView && "ttb" == store.get("viewer-direction") && (this.direction = "ttb"))
	}, initElements: function () {
		var e = $(t.body);
		e.dataset("episode-id", this.episodeId), e.dataset("purchased", this.episode.purchased), e.dataset("direction", this.direction), e.dataset("sides", this.sides), this.header = $("#viewer-main-header"), this.cutList = $("ttb" == this.direction ? "#scroll-list" : "#page-list"), this.pageController = $("#page-controller"), lc.Episode.canPurchase(this.episode, !0) || this.header.find("[data-action=purchase-episode]").parent().remove(), this.cuts || $(".scroll-control").remove(), this.pages ? ($("#viewer-progress-title").find(".total-page").html(this.pages), this.pageController.addClass("active")) : $(".page-control").remove(), this.header.addClass("active"), this.cuts && this.pages || this.header.find("[data-action=change-mode]").parent().remove(), "fullscreenElement" in t || "webkitFullscreenElement" in t || "mozFullScreenElement" in t || this.header.find("[data-action=full-screen]").parent().remove()
	}, initHandlers: function () {
		$(t).on("click", this.toggleMenu), this.header.on("click", "[data-action]", function () {
			var e = $(this), t = e.dataset("action"), i = lc.Viewer;
			if ("next-episode" == t || "prev-episode" == t) {
				var a = e.dataset("episode-id");
				a && ("next-episode" == t ? lc.Misc.trackAdeCorp(4, function () {
					lc.Episode.checkPermission(a)
				}) : lc.Episode.checkPermission(a))
			} else
				"change-mode" == t ? (e.blur(), i.changeMode()) : "purchase-episode" == t ? lc.Episode.checkPermission(i.episodeId, !0) : "full-screen" == t && i.toggleFullScreen()
		}), $("#scroll-controller").on("click", "[data-action]", function () {
			{
				var e = $(this), t = e.dataset("action");
				lc.Viewer
			}
			if ("next-episode" == t || "prev-episode" == t) {
				var i = e.dataset("episode-id");
				i && ("next-episode" == t ? lc.Misc.trackAdeCorp(4, function () {
					lc.Episode.checkPermission(i)
				}) : lc.Episode.checkPermission(i))
			}
		}), this.pageController.on("click", "[data-action]", function (e) {
			var t = $(this), i = t.dataset("action"), a = lc.Viewer;
			e.stopPropagation(), "first-page" == i ? a.firstPage() : "prev-page" == i ? a.prevPage() : "next-page" == i ? a.nextPage() : "last-page" == i && a.lastPage()
		}), $(e).on("resize", function () {
			var e = lc.Viewer;
			"ttb" != e.direction && (e.calcCutRatio(), e.cutList.find(".cut").css({width: e.cutWidth, height: e.cutHeight}))
		}), lc.HotKey.bindKeyUp(), $(t).on("keydown", function (e) {
			var t = lc.Viewer, i = t.direction;
			if ("ttb" != i) {
				var a = lc.HotKey.getKey(e);
				a && (e.stopPropagation(), "space" == a ? t[lc.HotKey.hold.shift ? "prevPage" : "nextPage"]() : "left" == a ? t["ltr" == i ? "prevPage" : "nextPage"]() : "right" == a ? t["ltr" == i ? "nextPage" : "prevPage"]() : "pageup" == a ? t.prevPage() : "pagedown" == a ? t.nextPage() : "home" == a ? t.firstPage() : "end" == a && t.lastPage(), "shift" != a && t.cutIndex != t.pages && t.hideMenu())
			}
		}), this.cutList.on("contextmenu", function (e) {
			e.preventDefault()
		}), $("#scroll-loader").find(".fail").on("click", function (e) {
			e.stopPropagation(), lc.Viewer.retry()
		}), $("#viewer-side-option").find("input").on("change", function () {
			var e = lc.Viewer, t = e.cutIndex, i = e.cutList, a = e.sides = parseInt(this.value);
			e.loadPages(), e.calcCutRatio(), $("body").dataset("sides", a), i.find(".cut").css({width: e.cutWidth, height: e.cutHeight}), i.find("[data-page-position]").removeAttr("data-page-position");
			for (var s = 0; a > s; ++s)
				i.find("[data-cut-index=" + (t - a + s) + "]").dataset("page-position", "prev"), i.find("[data-cut-index=" + (t + s) + "]").dataset("page-position", "curr"), i.find("[data-cut-index=" + (t + a + s) + "]").dataset("page-position", "next");
			this.blur(), store.set("viewer-page-side", a)
		}), $("#fit-width").on("click", function () {
			var e = lc.Viewer;
			e.fitWidth(), $(".cut").css({width: e.cutWidth, height: e.cutHeight})
		}), $("#fit-page").on("click", function () {
			var e = lc.Viewer;
			e.calcCutRatio(e.originalCutWidth, e.originalCutHeight), $(".cut").css({width: e.cutWidth, height: e.cutHeight})
		}), $(".next-page").on("click", function (e) {
			var t = lc.Viewer;
			e.stopPropagation(), t.nextPage(), t.hideMenu()
		}), $(".prev-page").on("click", function (e) {
			var t = lc.Viewer;
			e.stopPropagation(), t.prevPage(), t.hideMenu()
		}), $("#viewer-progress").on("click", function (e) {
			var t = lc.Viewer, i = $(this), a = (e.pageX - i.offset().left) / i.width();
			t.loadPages(Math.floor(t.pages * a) + 1), e.stopPropagation()
		}), this.cuts && this.initScrollHandler(), this.pages && this.initIdleHandler()
	}, initScrollHandler: function () {
		var i, a = 0;
		$(e).on("scroll", function () {
			var s = lc.Viewer, o = +new Date;
			if (!i)
				return i = o, void 0;
			var n = o - i;
			n > 500 && (s.header.removeClass("active"), i = 0);
			var c = $(t).scrollTop();
			(a > c && 10 > c || c >= $(t).height() - $(e).height() - 10) && s.header.addClass("active"), a = c
		})
	}, initIdleHandler: function () {
		this.idleTimer = 0, this.idleFlag = !1, $("#page-list").on("mousemove", function () {
			var e = lc.Viewer;
			e.idleFlag ? e.idleFlag = !1 : (e.idleTimer && (clearTimeout(e.idleTimer), e.idleTimer = 0), $("#page-list").removeClass("idle")), e.idleTimer = setTimeout(function () {
				e.idleFlag = !0, $("#page-list").addClass("idle")
			}, 1500)
		})
	}, setupNearEpisode: function () {
		var e = this.episode, t = lc.Episode.findPrevEpisode(e), i = lc.Episode.findNextEpisode(e), a = $("[data-action=prev-episode]"), s = $("[data-action=next-episode]");
		t ? (a.dataset("episode-id", t.episodeId), a.dataset("locked", !(t.purchased || t.free))) : a.prop("disabled", !0), i ? (s.dataset("episode-id", i.episodeId), s.dataset("locked", !(i.purchased || i.free))) : s.prop("disabled", !0)
	}, initBgm: function () {
		var e = this.episode.bgm, i = $("#toggle-bgm");
		if (!e || !e.file)
			return i.next("label").remove(), i.remove(), void 0;
		var a = store.get("viewer-bgm");
		i.toggleClass("play", void 0 === a ? !0 : a), i.on("change", this.toggleBgm);
		var s = $("<div/>").addClass("notification bgm").appendTo(t.body);
		s.html("이 만화는 배경 음악을 포함하고 있습니다.").animate({top: 60}, function () {
			$("#toggle-bgm").addClass("pointed")
		}), $.getScript(lc.App.cdn + "/js/vendor/jquery.jplayer.js", this.loadBgm)
	}, loadBgm: function () {
		var e = $("#audio-player");
		e.jPlayer({ready: function () {
			var e = lc.Viewer, t = $(this);
			t.jPlayer("setMedia", {mp3: e.episode.bgm.file}), $("#toggle-bgm").hasClass("play") && t.jPlayer("play")
		}, swfPath: lc.App.cdn + "/js/vendor"}), lc.Viewer.audio = e
	}, toggleBgm: function () {
		var e = this.checked, t = lc.Viewer.audio, i = $(this);
		t.jPlayer(e ? "play" : "pause"), i.toggleClass("play", e), i.blur(), store.set("viewer-bgm", e)
	}, changeMode: function () {
		var e = lc.Viewer, i = e.episode.direction, a = $(t), s = $("body"), o = "ttb" == e.direction;
		if (o) {
			s.dataset("direction", i), e.direction = i, e.cutList = $("#page-list");
			var n = Math.floor(e.cuts * a.scrollTop() / a.height());
			e.loadPages(n), $(".scroll-control").removeClass("active")
		} else
			s.dataset("direction", "ttb"), e.direction = "ttb", e.cutList = $("#scroll-list"), e.loadCuts(1), $(".page-control").removeClass("active"), lc.Recommended.getComics();
		store.set("viewer-direction", e.direction)
	}, toggleElements: function () {
		$("#recommended-comics").removeClass("active")
	}, toggleFullScreen: function () {
		var e = t.documentElement;
		t.fullscreenElement || t.webkitFullscreenElement || t.mozFullScreenElement ? t.cancelFullScreen ? t.cancelFullScreen() : t.webkitCancelFullScreen ? t.webkitCancelFullScreen() : t.mozCancelFullScreen && t.mozCancelFullScreen() : e.requestFullscreen ? e.requestFullscreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT) : e.mozRequestFullScreen && e.mozRequestFullScreen()
	}, loadFirstCut: function () {
		var t = this.loadCut(1);
		t.done(function () {
			var e = lc.Viewer;
			"ttb" == e.direction ? e.loadCuts(2) : e.loadPages()
		}), t.fail(function () {
		}), t.always(function () {
			e.setTimeout(function () {
				$("#toggle-bgm").removeClass("pointed"), $(".notification.bgm").animate({top: -60}, function () {
					$(this).remove()
				}), lc.Viewer.hideMenu()
			}, 3e3)
		})
	}, loadCuts: function (e, t) {
		for (var i = [], a = e; a <= this.cuts; ++a)
			i.push(this.loadCut(a));
		var s = $.when.apply(this, i);
		s.done(function () {
			lc.Viewer.finish(), t && t()
		})
	}, loadPages: function (e) {
		e = e || this.cutIndex, this.sides > 1 && (e = Math.floor((e + this.sides - 1) / this.sides) * this.sides - 1);
		var t, i = this.sides * this.preload, a = Math.max(e - i, 1), s = this.preload ? Math.min(e + this.sides + i - 1, this.pages) : this.pages;
		this.cutList.find("[data-page-position]").removeAttr("data-page-position");
		for (var o = a; s >= o; ++o)
			e > o ? o >= e - this.sides && (t = "prev") : t = o < e + this.sides ? "curr" : o < e + 2 * this.sides ? "next" : null, this.loadCut(o, t);
		this.cutList.find(".cut").each(function () {
			var e = $(this), t = e.dataset("cut-index");
			(a > t || t > s) && e.remove()
		}), this.cutIndex = e, this.setProgress(), this.setCursor()
	}, loadCut: function (e, t) {
		var i = this.cutList.find("[data-cut-index=" + e + "]");
		if (i.length)
			return i.dataset("page-position", t), void 0;
		i = $("<div/>"), i.addClass("cut"), i.dataset("cut-index", e), i.dataset("cut-status", "ready"), i.dataset("page-position", t), this.pages && i.dataset("page-side", (e - 1) % 2 + 1), "ttb" != this.direction && this.cutRatio && i.css({width: this.cutWidth, height: this.cutHeight}), i.appendTo(this.cutList);
		var a = this.loadImage(e);
		return a.done(this.success), a.fail(this.fail), a
	}, loadImage: function (e) {
		var t = $.Deferred(), i = $("<img/>");
		lc.App.can.draggable && i.attr("draggable", !1), i.on("load", t.resolve), i.on("error", t.reject);
		var a = this.buildUrl(e);
		return i.dataset("index", e), i.attr("src", a), t.promise()
	}, success: function () {
		var e = lc.Viewer, t = this.width, i = this.height, a = this.getAttribute("data-index"), s = e.cutList.find("[data-cut-index=" + a + "]"), o = "ttb" == e.direction;
		o || e.cutRatio || (e.originalCutWidth = t, e.originalCutHeight = i, e.calcCutRatio(t, i), s.css({width: e.cutWidth, height: e.cutHeight})), s.dataset("cut-status", "success"), s.append(this), o && e.showLoadedCuts()
	}, fail: function () {
		var e = lc.Viewer, t = this.getAttribute("data-cut-index"), i = e.cutList.find("[data-cut-index=" + t + "]");
		i.dataset("cut-status", "fail"), "ttb" == e.direction && $("#scroll-loader").dataset("status", "fail")
	}, retry: function () {
		var e = lc.Viewer, t = [];
		"ttb" == e.direction && $("#scroll-loader").dataset("status", "loading"), e.cutList.find("[data-cut-status=fail]").each(function () {
			var i = this.getAttribute("data-cut-index");
			t.push(e.loadImage(i))
		});
		var i = $.when.apply(e, t);
		i.done(e.finish), i.fail(e.fail)
	}, finish: function () {
		$("#scroll-loader").remove(), $("#invite-friends").addClass("active"), $("#artist-comment").addClass("active"), $("#scroll-controller").addClass("active"), lc.Recommended.getComics(), lc.Viewer.getAds()
	}, showLoadedCuts: function () {
		for (var e = this.cutList, t = this.loadIndex + 1, i = this.cuts; i >= t; ++t) {
			var a = e.find("[data-cut-index=" + t + "]");
			if ("success" != a.dataset("cut-status"))
				break;
			a.dataset("page-position", "curr"), this.loadIndex = t
		}
	}, setProgress: function () {
		var e = Math.min((this.cutIndex + this.sides - 1) / this.pages * 100, 100);
		$("#viewer-progress-meter").css({width: e + "%"});
		var t = Math.min(this.cutIndex + this.sides - 1, this.pages);
		$("#viewer-progress-title").find(".curr-page").html(t)
	}, setCursor: function () {
		var e, t = 1 == this.cutIndex;
		e = 1 == this.sides ? this.cutIndex == this.pages : Math.ceil(this.cutIndex / this.sides) == Math.ceil(this.pages / this.sides), $(".prev-page").toggleClass("disabled", t), $(".next-page").toggleClass("disabled", e);
		var i = this.pageController;
		i.find("[data-action=first-page]").prop("disabled", t), i.find("[data-action=prev-page]").prop("disabled", t), i.find("[data-action=last-page]").prop("disabled", e), i.find("[data-action=next-page]").prop("disabled", e)
	}, calcCutRatio: function (t, i) {
		var a = $(e), s = Math.floor((a.width() || screen.availWidth) / this.sides), o = a.height() || screen.availHeight, n = s / o;
		t = t || this.originalCutWidth, i = i || this.originalCutHeight;
		var c = t / i;
		n > c ? (this.cutWidth = Math.floor(o * c), this.cutHeight = o) : (this.cutWidth = s, this.cutHeight = Math.floor(s / c));
		var r = 1280;
		this.cutWidth > r && (this.cutWidth = r, this.cutHeight = Math.floor(this.cutWidth / c)), this.cutRatio = c;
		var d = this.cutWidth * this.sides, l = {height: this.cutHeight, marginLeft: -Math.floor(d / 2), marginTop: -Math.floor(this.cutHeight / 2), width: d};
		this.cutList.css(l)
	}, fitWidth: function () {
		var t = $(e), i = Math.floor(t.width() / this.config.sides), a = (t.height(), this.originalCutWidth / this.originalCutHeight);
		this.cutWidth = i, this.cutHeight = Math.floor(i / a), this.cutRatio = a, this.cutList.css({height: this.cutHeight, left: 0, marginLeft: 0, marginTop: -Math.floor(this.cutHeight / 2)})
	}, showMenu: function () {
		var e = lc.Viewer;
		e.header.addClass("active"), e.pageController.addClass("active")
	}, hideMenu: function () {
		var e = lc.Viewer;
		e.header.removeClass("active"), e.pageController.removeClass("active")
	}, toggleMenu: function (e) {
		e.stopPropagation();
		var t = lc.Viewer;
		t.header.toggleClass("active"), "ttb" != t.direction && t.pageController.toggleClass("active", t.header.hasClass("active"))
	}, firstPage: function () {
		var e = lc.Viewer;
		e.loadPages(1)
	}, lastPage: function () {
		var e = lc.Viewer;
		e.loadPages(e.pages)
	}, nextPage: function (e) {
		var t = lc.Viewer, i = t.cutIndex, a = t.sides, s = i + a;
		e && e.stopPropagation(), s > t.pages || (t.loadPages(s), s == t.pages && t.showMenu())
	}, prevPage: function (e) {
		var t = lc.Viewer, i = t.cutIndex, a = t.sides, s = i - a;
		e && e.stopPropagation(), 1 > s || t.loadPages(s)
	}, buildUrl: function (e) {
		var t = this.baseUrl, i = !!this.playerId;
		return t += i ? "/play/" + this.playerId + "/episodes/" + this.episodeId : "/episodes/" + this.episodeId, t += ("ttb" == this.direction ? "/contents/" : "/pages/") + e, this.accessToken && (t += i ? "?playKey=" + this.accessToken : "?access_token=" + this.accessToken + "&purchased=" + this.episode.purchased), t
	}, getAds: function () {
		var e = this.metaData;
		if (!this.episode.purchased && e && e.ads && e.ads.cut)
			for (var t = e.ads.cut, i = 0, a = t.length; a > i; ++i) {
				var s = t[i], o = $("<a/>");
				o.attr({href: s.href, target: "_blank"}), o.dataset("page-position", "curr"), o.addClass("cut"), o.appendTo("#scroll-list");
				var n = $("<img/>");
				n.attr("src", s.url), n.appendTo(o)
			}
	}}, lc.Recommended = {init: function () {
		var e = $("#recommended-comics");
		e.on("click", ".comic", function () {
			var e = $(this), t = e.dataset("comic-id"), i = {source: lc.Viewer.comicId, pick: t, method: e.dataset("method"), redirect: encodeURIComponent("http://lezhin.com/comic/" + t)}, a = "https://api.recopick.com/1/banner/40/pick?source={{source}}&pick={{pick}}&method={{method}}&url={{redirect}}";
			location.href = lc.Util.template(a, i)
		}), e.on("mouseenter", ".comic", function () {
			var e = $(this);
			e.find(".comic-cover").fadeOut(), e.find(".info").fadeIn()
		}), e.on("mouseleave", ".comic", function () {
			var e = $(this);
			e.find(".comic-cover").fadeIn(), e.find(".info").fadeOut()
		}), this.initialized = !0
	}, getComics: function () {
		return this.initialized ? ($("#recommended-comics").addClass("active"), void 0) : (this.init(), $.getScript("https://api.recopick.com/2/recommend/40/" + lc.Viewer.comicId + "?count=10&field=meta&callback=lc.Recommended.setComics"), void 0)
	}, setComics: function (e) {
		var t = $("#recommended-comics"), i = t.find("ul"), a = $("#recommended-comic-template").html();
		e.sort(function () {
			return .5 - Math.random()
		});
		for (var s = 0, o = Math.min(e.length, 5); o > s; ++s) {
			var n = e[s];
			n.cover = "http://cdn.lezhin.com/comics/" + n.id + "/cover", n.description = n.description.replace(/^\((.+)\)/, '<p class="genre">$1</p>');
			var c = lc.Util.template(a, n);
			i.append(c)
		}
		o && t.addClass("active")
	}}, lc.App.init(), lc.Misc = {trackAdeCorp: function (e, t) {
		var i = "http://track.adecorp.co.kr/ade_track?track=1737&page=" + e;
		i += "&date=" + lc.Util.formatDate("yyyymmdd"), i += "&ord=" + Math.floor(1e4 * Math.random());
		var a = new Image;
		a.onload = t, a.onerror = t, a.src = i
	}}
}(window, document);
