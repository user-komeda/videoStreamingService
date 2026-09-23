import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration, ServerRouter, UNSAFE_withComponentProps, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, useFetcher, useParams } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { QueryClient, QueryClientProvider, queryOptions, useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { cva } from "class-variance-authority";
import { cn } from "cn";
import { Button } from "@base-ui/react/button";
import { ArrowUpDown, Bell, Bookmark, Check, ChevronDown, ChevronRight, Clock, Compass, Download, ExternalLink, Film, Flag, Flame, Globe, HelpCircle, History, Home, Keyboard, Languages, LogIn, LogOut, Maximize, Menu, MessageSquareWarning, Mic, Minimize, Moon, MoreHorizontal, Pause, Pencil, Play, PlusSquare, Receipt, RotateCcw, Scissors, Search, Settings, Share2, ShieldAlert, ShieldCheck, ThumbsDown, ThumbsUp, Trash2, Tv, UserCheck, UserCircle, Video, Volume2, VolumeX } from "lucide-react";
import * as zod from "zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import Hls from "hls.js";
import { UppyContext, UppyContextProvider, useDropzone, useUppyEvent, useUppyState } from "@uppy/react";
import Uppy from "@uppy/core";
import Tus from "@uppy/tus";
import { Progress } from "@base-ui/react/progress";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { useStore } from "@tanstack/react-store";
import { formOptions, mergeForm, useForm } from "@tanstack/react-form";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region ../../node_modules/@react-router/dev/dist/config/defaults/entry.server.node.tsx
var entry_server_node_exports = /* @__PURE__ */ __exportAll({
	default: () => handleRequest,
	streamTimeout: () => streamTimeout
});
var streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
	if (request.method.toUpperCase() === "HEAD") return new Response(null, {
		status: responseStatusCode,
		headers: responseHeaders
	});
	return new Promise((resolve, reject) => {
		let shellRendered = false;
		let userAgent = request.headers.get("user-agent");
		let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
		let timeoutId = setTimeout(() => abort(), 6e3);
		const { pipe, abort } = renderToPipeableStream(/* @__PURE__ */ jsx(ServerRouter, {
			context: routerContext,
			url: request.url
		}), {
			[readyOption]() {
				shellRendered = true;
				const body = new PassThrough({ final(callback) {
					clearTimeout(timeoutId);
					timeoutId = void 0;
					callback();
				} });
				const stream = createReadableStreamFromReadable(body);
				responseHeaders.set("Content-Type", "text/html");
				pipe(body);
				resolve(new Response(stream, {
					headers: responseHeaders,
					status: responseStatusCode
				}));
			},
			onShellError(error) {
				reject(error);
			},
			onError(error) {
				responseStatusCode = 500;
				if (shellRendered) console.error(error);
			}
		});
	});
}
//#endregion
//#region src/components/ui/alert.tsx
var alertVariants = cva("group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4", {
	variants: { variant: {
		default: "bg-card text-card-foreground",
		destructive: "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current"
	} },
	defaultVariants: { variant: "default" }
});
function Alert({ className, variant, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "alert",
		role: "alert",
		className: cn(alertVariants({ variant }), className),
		...props
	});
}
function AlertTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "alert-title",
		className: cn("[&_a]:hover:text-foreground font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3", className),
		...props
	});
}
function AlertDescription({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "alert-description",
		className: cn("text-muted-foreground [&_a]:hover:text-foreground text-sm text-balance md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4", className),
		...props
	});
}
//#endregion
//#region src/lib/utils.ts
var cn$1 = cn;
//#endregion
//#region src/components/ui/button.tsx
var buttonVariants = cva("group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/80",
			outline: "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
			secondary: "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
			ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
			destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
			sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
			lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
			icon: "size-8",
			"icon-xs": "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
			"icon-sm": "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
			"icon-lg": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button$1 = ({ className, variant = "default", size = "default", ...props }) => {
	return /* @__PURE__ */ jsx(Button, {
		"data-slot": "button",
		className: cn$1(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
};
//#endregion
//#region src/components/ui/card.tsx
function Card({ className, size = "default", ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card",
		"data-size": size,
		className: cn("group/card bg-card text-card-foreground ring-foreground/10 flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl py-(--card-spacing) text-sm ring-1 [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl", className),
		...props
	});
}
function CardHeader({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card-header",
		className: cn("group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)", className),
		...props
	});
}
function CardTitle({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card-title",
		className: cn("font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm", className),
		...props
	});
}
function CardContent({ className, ...props }) {
	return /* @__PURE__ */ jsx("div", {
		"data-slot": "card-content",
		className: cn("px-(--card-spacing)", className),
		...props
	});
}
//#endregion
//#region src/components/common/RootErrorBoundary.tsx
var getErrorInfo = (error) => {
	if (isRouteErrorResponse(error)) return {
		message: error.status === 404 ? "404" : "Error",
		details: error.status === 404 ? "The requested page could not be found." : error.statusText || "An unexpected error occurred.",
		stack: void 0
	};
	return {
		message: "Oops!",
		details: "An unexpected error occurred.",
		stack: void 0
	};
};
var RootErrorBoundary = ({ error }) => {
	const { message, details, stack } = getErrorInfo(error);
	return /* @__PURE__ */ jsxs("main", {
		className: "container mx-auto max-w-2xl p-4 pt-16",
		children: [
			/* @__PURE__ */ jsxs(Alert, {
				variant: "destructive",
				className: "mb-6",
				children: [/* @__PURE__ */ jsx(AlertTitle, { children: message }), /* @__PURE__ */ jsx(AlertDescription, { children: details })]
			}),
			stack ? /* @__PURE__ */ jsxs(Card, {
				className: "mb-6",
				children: [/* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, {
					className: "font-mono text-sm",
					children: "Stack Trace"
				}) }), /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("pre", {
					className: "bg-muted text-muted-foreground max-h-96 overflow-x-auto rounded p-4 font-mono text-xs",
					children: /* @__PURE__ */ jsx("code", { children: stack })
				}) })]
			}) : null,
			/* @__PURE__ */ jsx(Button$1, {
				variant: "outline",
				onClick: () => window.location.reload(),
				children: "再読み込み"
			})
		]
	});
};
//#endregion
//#region app/root.tsx
var root_exports = /* @__PURE__ */ __exportAll({
	ErrorBoundary: () => ErrorBoundary,
	Layout: () => Layout$1,
	default: () => root_default,
	meta: () => meta$1
});
var meta$1 = () => [{ title: "Video Streaming Service" }, {
	name: "description",
	content: "Video Streaming Service application"
}];
var Layout$1 = ({ children }) => {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
			/* @__PURE__ */ jsx("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			}),
			/* @__PURE__ */ jsx(Meta, {}),
			/* @__PURE__ */ jsx(Links, {})
		] }), /* @__PURE__ */ jsxs("body", { children: [
			children,
			/* @__PURE__ */ jsx(ScrollRestoration, {}),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
};
var App = () => {
	const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: {
		staleTime: 3e5,
		retry: 1
	} } }));
	useEffect(() => {}, []);
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsx(Outlet, {})
	});
};
var root_default = UNSAFE_withComponentProps(App);
var ErrorBoundary = UNSAFE_withErrorBoundaryProps(({ error }) => /* @__PURE__ */ jsx(RootErrorBoundary, { error }));
//#endregion
//#region src/components/header/UserMenuAccountGroup.tsx
var AccountGroup = ({ onLogout, onClose }) => /* @__PURE__ */ jsxs("div", {
	className: "border-b py-2",
	children: [
		/* @__PURE__ */ jsxs("button", {
			type: "button",
			className: "hover:bg-muted flex w-full items-center gap-3 px-4 py-2 text-left text-sm",
			children: [/* @__PURE__ */ jsx("span", {
				className: "w-5 text-center text-base font-bold",
				children: "G"
			}), /* @__PURE__ */ jsx("span", { children: "Google アカウント" })]
		}),
		/* @__PURE__ */ jsxs("button", {
			type: "button",
			className: "hover:bg-muted flex w-full items-center justify-between px-4 py-2 text-left text-sm",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ jsx(UserCheck, { className: "h-5 w-5" }), /* @__PURE__ */ jsx("span", { children: "アカウントを切り替える" })]
			}), /* @__PURE__ */ jsx(ChevronRight, { className: "text-muted-foreground h-4 w-4" })]
		}),
		/* @__PURE__ */ jsxs("button", {
			type: "button",
			onClick: () => {
				onLogout();
				onClose();
			},
			className: "hover:bg-muted flex w-full items-center gap-3 px-4 py-2 text-left text-sm",
			children: [/* @__PURE__ */ jsx(LogOut, { className: "h-5 w-5" }), /* @__PURE__ */ jsx("span", { children: "ログアウト" })]
		})
	]
});
//#endregion
//#region src/components/header/UserMenuSettingsGroup.tsx
var STUDIO_ITEMS = [{
	icon: PlusSquare,
	label: "YouTube Studio"
}, {
	icon: Receipt,
	label: "購入とメンバーシップ"
}];
var PREF_ITEMS = [
	{
		icon: ShieldCheck,
		label: "YouTube でのデータ"
	},
	{
		icon: Moon,
		label: "デザイン: デバイスのテーマ",
		hasArrow: true
	},
	{
		icon: Languages,
		label: "表示言語: 日本語",
		hasArrow: true
	},
	{
		icon: ShieldAlert,
		label: "制限付きモード: オフ",
		hasArrow: true
	},
	{
		icon: Globe,
		label: "場所: 日本",
		hasArrow: true
	},
	{
		icon: Keyboard,
		label: "キーボード ショートカット"
	}
];
var HELP_ITEMS = [{
	icon: HelpCircle,
	label: "ヘルプ"
}, {
	icon: MessageSquareWarning,
	label: "フィードバックを送信"
}];
var StudioAndDataGroup = () => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
	className: "border-b py-2",
	children: STUDIO_ITEMS.map(({ icon: Icon, label }) => /* @__PURE__ */ jsxs("button", {
		type: "button",
		className: "hover:bg-muted flex w-full items-center gap-3 px-4 py-2 text-left text-sm",
		children: [/* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }), /* @__PURE__ */ jsx("span", { children: label })]
	}, label))
}), /* @__PURE__ */ jsx("div", {
	className: "border-b py-2",
	children: PREF_ITEMS.map(({ icon: Icon, label, hasArrow }) => /* @__PURE__ */ jsxs("button", {
		type: "button",
		className: "hover:bg-muted flex w-full items-center justify-between px-4 py-2 text-left text-sm",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }), /* @__PURE__ */ jsx("span", { children: label })]
		}), hasArrow ? /* @__PURE__ */ jsx(ChevronRight, { className: "text-muted-foreground h-4 w-4" }) : null]
	}, label))
})] });
var SettingsAndHelpGroup = () => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
	className: "border-b py-2",
	children: /* @__PURE__ */ jsxs("button", {
		type: "button",
		className: "hover:bg-muted flex w-full items-center gap-3 px-4 py-2 text-left text-sm",
		children: [/* @__PURE__ */ jsx(Settings, { className: "h-5 w-5" }), /* @__PURE__ */ jsx("span", { children: "設定" })]
	})
}), /* @__PURE__ */ jsx("div", {
	className: "py-2",
	children: HELP_ITEMS.map(({ icon: Icon, label }) => /* @__PURE__ */ jsxs("button", {
		type: "button",
		className: "hover:bg-muted flex w-full items-center gap-3 px-4 py-2 text-left text-sm",
		children: [/* @__PURE__ */ jsx(Icon, { className: "h-5 w-5" }), /* @__PURE__ */ jsx("span", { children: label })]
	}, label))
})] });
//#endregion
//#region src/components/header/UserMenuDropdown.tsx
var UserProfileHeader = () => /* @__PURE__ */ jsxs("div", {
	className: "flex items-start gap-3 border-b px-4 py-3",
	children: [/* @__PURE__ */ jsx("div", {
		className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-700 text-sm font-bold text-white",
		children: "TODO"
	}), /* @__PURE__ */ jsxs("div", {
		className: "flex min-w-0 flex-col",
		children: [
			/* @__PURE__ */ jsx("span", {
				className: "truncate text-sm font-semibold",
				children: "TODO"
			}),
			/* @__PURE__ */ jsx("span", {
				className: "text-muted-foreground truncate text-xs",
				children: "TODO"
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				className: "mt-2 text-left text-xs text-blue-500 hover:underline",
				children: "チャンネルを表示"
			})
		]
	})]
});
var UserMenuDropdown = ({ isOpen, onClose, onLogout }) => {
	if (!isOpen) return null;
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 bg-transparent",
		onClick: onClose,
		onKeyDown: (e) => {
			if (e.key === "Escape") onClose();
		},
		role: "button",
		tabIndex: 0,
		"aria-label": "メニューを閉じる"
	}), /* @__PURE__ */ jsxs("div", {
		className: "bg-background absolute top-12 right-0 z-50 max-h-[calc(100vh-4rem)] w-72 overflow-y-auto rounded-2xl border py-2 text-sm shadow-2xl",
		children: [
			/* @__PURE__ */ jsx(UserProfileHeader, {}),
			/* @__PURE__ */ jsx(AccountGroup, {
				onLogout,
				onClose
			}),
			/* @__PURE__ */ jsx(StudioAndDataGroup, {}),
			/* @__PURE__ */ jsx(SettingsAndHelpGroup, {})
		]
	})] });
};
//#endregion
//#region src/components/header/HeaderActions.tsx
var NotLogin = ({ onToggleLogin }) => {
	return /* @__PURE__ */ jsxs(Button$1, {
		variant: "outline",
		size: "sm",
		onClick: onToggleLogin,
		className: "flex items-center gap-1.5 border-blue-200 text-blue-600 hover:bg-blue-50",
		children: [/* @__PURE__ */ jsx(LogIn, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "ログイン (切替)" })]
	});
};
var AlreadyLogin = ({ isMenuOpen, setIsMenuOpen, onToggleLogin }) => {
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Button$1, {
			variant: "ghost",
			size: "icon",
			"aria-label": "作成",
			children: /* @__PURE__ */ jsx(Video, { className: "h-5 w-5" })
		}),
		/* @__PURE__ */ jsx(Button$1, {
			variant: "ghost",
			size: "icon",
			"aria-label": "通知",
			children: /* @__PURE__ */ jsx(Bell, { className: "h-5 w-5" })
		}),
		/* @__PURE__ */ jsx("button", {
			type: "button",
			onClick: () => setIsMenuOpen((prev) => !prev),
			className: "hover:ring-primary flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-pink-700 text-xs font-bold text-white hover:ring-2 focus:outline-none",
			"aria-label": "ユーザーメニュー",
			children: "TODO"
		}),
		/* @__PURE__ */ jsx(UserMenuDropdown, {
			isOpen: isMenuOpen,
			onClose: () => setIsMenuOpen(false),
			onLogout: () => {
				setIsMenuOpen(false);
				onToggleLogin();
			}
		})
	] });
};
var HeaderActions = ({ isLoggedIn, isMenuOpen, setIsMenuOpen, onToggleLogin }) => {
	return /* @__PURE__ */ jsx("div", {
		className: "relative flex items-center gap-2",
		children: isLoggedIn ? /* @__PURE__ */ jsx(AlreadyLogin, {
			isMenuOpen,
			setIsMenuOpen,
			onToggleLogin
		}) : /* @__PURE__ */ jsx(NotLogin, { onToggleLogin })
	});
};
//#endregion
//#region src/components/ui/input.tsx
function Input({ className, type, ...props }) {
	return /* @__PURE__ */ jsx("input", {
		type,
		"data-slot": "input",
		className: cn("border-input file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 disabled:bg-input/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-3 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3 md:text-sm", className),
		...props
	});
}
//#endregion
//#region src/components/header/HeaderSearch.tsx
var HeaderSearch = () => /* @__PURE__ */ jsx("div", {
	className: "hidden max-w-2xl flex-1 items-center justify-center px-4 sm:flex",
	children: /* @__PURE__ */ jsxs("div", {
		className: "flex w-full items-center",
		children: [
			/* @__PURE__ */ jsx("div", {
				className: "relative flex-1",
				children: /* @__PURE__ */ jsx(Input, {
					type: "text",
					placeholder: "検索",
					className: "min-h-[36px] w-full min-w-[120px] rounded-r-none border-r-0 focus-visible:ring-0"
				})
			}),
			/* @__PURE__ */ jsx(Button$1, {
				variant: "secondary",
				className: "min-h-[36px] min-w-[48px] rounded-l-none border border-l-0 px-5",
				"aria-label": "検索",
				children: /* @__PURE__ */ jsx(Search, { className: "text-muted-foreground h-4 w-4" })
			}),
			/* @__PURE__ */ jsx(Button$1, {
				variant: "ghost",
				size: "icon",
				className: "ml-2 min-h-[36px] min-w-[36px] rounded-full",
				"aria-label": "音声検索",
				children: /* @__PURE__ */ jsx(Mic, { className: "h-4 w-4" })
			})
		]
	})
});
//#endregion
//#region src/components/header/headerLeft.tsx
var HeaderLeft = ({ onToggleSidebar }) => /* @__PURE__ */ jsxs("div", {
	className: "flex items-center gap-4",
	children: [/* @__PURE__ */ jsx(Button$1, {
		variant: "ghost",
		size: "icon",
		onClick: onToggleSidebar,
		"aria-label": "メニュー",
		children: /* @__PURE__ */ jsx(Menu, { className: "h-5 w-5" })
	}), /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-1 text-lg font-bold tracking-tight",
		children: [/* @__PURE__ */ jsx("span", {
			className: "flex h-6 w-8 items-center justify-center rounded-lg bg-red-600 text-xs font-black text-white",
			children: "▶"
		}), /* @__PURE__ */ jsx("span", { children: "StreamHub" })]
	})]
});
//#endregion
//#region src/components/header/Header.tsx
var Header = ({ isLoggedIn, onToggleLogin, onToggleSidebar }) => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	return /* @__PURE__ */ jsxs("header", {
		className: "bg-background sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b px-4",
		children: [
			/* @__PURE__ */ jsx(HeaderLeft, { onToggleSidebar }),
			/* @__PURE__ */ jsx("div", {
				className: "hidden flex-1 items-center justify-center sm:flex",
				children: /* @__PURE__ */ jsx(HeaderSearch, {})
			}),
			/* @__PURE__ */ jsx(HeaderActions, {
				isLoggedIn,
				isMenuOpen,
				setIsMenuOpen,
				onToggleLogin
			})
		]
	});
};
//#endregion
//#region src/components/sidebar/SidebarCollapsed.tsx
var SidebarCollapsed = () => /* @__PURE__ */ jsxs("aside", {
	className: "bg-background flex min-h-[calc(100vh-3.5rem)] w-18 shrink-0 flex-col items-center gap-4 border-r px-1 py-3",
	children: [
		/* @__PURE__ */ jsxs(Button$1, {
			variant: "ghost",
			className: "flex h-16 w-16 flex-col gap-1 p-0 text-[10px]",
			children: [/* @__PURE__ */ jsx(Home, { className: "h-5 w-5" }), "ホーム"]
		}),
		/* @__PURE__ */ jsxs(Button$1, {
			variant: "ghost",
			className: "flex h-16 w-16 flex-col gap-1 p-0 text-[10px]",
			children: [/* @__PURE__ */ jsx(Film, { className: "h-5 w-5" }), "Shorts"]
		}),
		/* @__PURE__ */ jsxs(Button$1, {
			variant: "ghost",
			className: "flex h-16 w-16 flex-col gap-1 p-0 text-[10px]",
			children: [/* @__PURE__ */ jsx(Tv, { className: "h-5 w-5" }), "登録チャンネル"]
		}),
		/* @__PURE__ */ jsxs(Button$1, {
			variant: "ghost",
			className: "flex h-16 w-16 flex-col gap-1 p-0 text-[10px]",
			children: [/* @__PURE__ */ jsx(History, { className: "h-5 w-5" }), "ライブラリ"]
		})
	]
});
//#endregion
//#region src/components/sidebar/SidebarSubscriptions.tsx
var SidebarSubscriptions = () => {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ jsx("div", {
			className: "text-muted-foreground px-3 py-1 text-xs font-semibold",
			children: "登録チャンネル"
		}), /* @__PURE__ */ jsxs(Button$1, {
			variant: "ghost",
			className: "text-muted-foreground h-10 w-full justify-start gap-3 px-3 py-1.5 font-normal",
			children: [/* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ jsx("span", {
				className: "text-sm",
				children: "さらに表示"
			})]
		})]
	});
};
//#endregion
//#region src/components/sidebar/SidebarUserSection.tsx
var LoggedInUserSection = () => /* @__PURE__ */ jsxs("div", {
	className: "space-y-1",
	children: [
		/* @__PURE__ */ jsx("div", {
			className: "text-muted-foreground px-3 py-1 text-xs font-semibold",
			children: "ライブラリ"
		}),
		/* @__PURE__ */ jsxs(Button$1, {
			variant: "ghost",
			className: "w-full justify-start gap-4",
			children: [/* @__PURE__ */ jsx(History, { className: "h-4 w-4" }), "履歴"]
		}),
		/* @__PURE__ */ jsxs(Button$1, {
			variant: "ghost",
			className: "w-full justify-start gap-4",
			children: [/* @__PURE__ */ jsx(Clock, { className: "h-4 w-4" }), "後で見る"]
		}),
		/* @__PURE__ */ jsxs(Button$1, {
			variant: "ghost",
			className: "w-full justify-start gap-4",
			children: [/* @__PURE__ */ jsx(ThumbsUp, { className: "h-4 w-4" }), "高く評価した動画"]
		})
	]
});
var LoggedOutUserSection = ({ onToggleLogin }) => /* @__PURE__ */ jsxs("div", {
	className: "bg-muted/40 space-y-3 rounded-lg px-3 py-2",
	children: [/* @__PURE__ */ jsx("p", {
		className: "text-muted-foreground text-xs leading-relaxed",
		children: "ログインすると、動画の高評価やチャンネル登録、コメントができるようになります。"
	}), /* @__PURE__ */ jsxs(Button$1, {
		variant: "outline",
		size: "sm",
		onClick: onToggleLogin,
		className: "w-full border-blue-200 text-blue-600",
		children: [/* @__PURE__ */ jsx(UserCircle, { className: "mr-2 h-4 w-4" }), "ログイン"]
	})]
});
var SidebarUserSection = ({ isLoggedIn, onToggleLogin }) => {
	if (isLoggedIn) return /* @__PURE__ */ jsx(LoggedInUserSection, {});
	return /* @__PURE__ */ jsx(LoggedOutUserSection, { onToggleLogin });
};
//#endregion
//#region src/components/sidebar/SidebarExpanded.tsx
var MainNavigation = () => /* @__PURE__ */ jsxs("div", {
	className: "space-y-1",
	children: [
		/* @__PURE__ */ jsxs(Button$1, {
			variant: "secondary",
			className: "w-full justify-start gap-4",
			children: [/* @__PURE__ */ jsx(Home, { className: "h-4 w-4" }), "ホーム"]
		}),
		/* @__PURE__ */ jsxs(Button$1, {
			variant: "ghost",
			className: "w-full justify-start gap-4",
			children: [/* @__PURE__ */ jsx(Film, { className: "h-4 w-4" }), "Shorts"]
		}),
		/* @__PURE__ */ jsxs(Button$1, {
			variant: "ghost",
			className: "w-full justify-start gap-4",
			children: [/* @__PURE__ */ jsx(Tv, { className: "h-4 w-4" }), "登録チャンネル"]
		})
	]
});
var ExploreSection = () => /* @__PURE__ */ jsxs("div", {
	className: "space-y-1",
	children: [/* @__PURE__ */ jsx("div", {
		className: "text-muted-foreground px-3 py-1 text-xs font-semibold",
		children: "探索"
	}), /* @__PURE__ */ jsxs(Button$1, {
		variant: "ghost",
		className: "w-full justify-start gap-4",
		children: [/* @__PURE__ */ jsx(Compass, { className: "h-4 w-4" }), "急上昇"]
	})]
});
var SidebarFooter = () => /* @__PURE__ */ jsxs("div", {
	className: "space-y-1",
	children: [
		/* @__PURE__ */ jsxs(Button$1, {
			variant: "ghost",
			className: "w-full justify-start gap-4",
			children: [/* @__PURE__ */ jsx(Settings, { className: "h-4 w-4" }), "設定"]
		}),
		/* @__PURE__ */ jsxs(Button$1, {
			variant: "ghost",
			className: "w-full justify-start gap-4",
			children: [/* @__PURE__ */ jsx(Flag, { className: "h-4 w-4" }), "報告履歴"]
		}),
		/* @__PURE__ */ jsxs(Button$1, {
			variant: "ghost",
			className: "w-full justify-start gap-4",
			children: [/* @__PURE__ */ jsx(HelpCircle, { className: "h-4 w-4" }), "ヘルプ"]
		})
	]
});
var SidebarExpanded = ({ isLoggedIn, onToggleLogin }) => /* @__PURE__ */ jsxs("aside", {
	className: "bg-background min-h-[calc(100vh-3.5rem)] w-60 shrink-0 space-y-4 overflow-y-auto border-r p-3 text-sm",
	children: [
		/* @__PURE__ */ jsx(MainNavigation, {}),
		/* @__PURE__ */ jsx("hr", { className: "border-border" }),
		/* @__PURE__ */ jsx(SidebarUserSection, {
			isLoggedIn,
			onToggleLogin
		}),
		isLoggedIn && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("hr", { className: "border-border" }), /* @__PURE__ */ jsx(SidebarSubscriptions, {})] }),
		/* @__PURE__ */ jsx("hr", { className: "border-border" }),
		/* @__PURE__ */ jsx(ExploreSection, {}),
		/* @__PURE__ */ jsx("hr", { className: "border-border" }),
		/* @__PURE__ */ jsx(SidebarFooter, {})
	]
});
//#endregion
//#region src/components/sidebar/Sidebar.tsx
var Sidebar = ({ isExpanded, isLoggedIn, onToggleLogin }) => {
	if (!isExpanded) return /* @__PURE__ */ jsx(SidebarCollapsed, {});
	return /* @__PURE__ */ jsx(SidebarExpanded, {
		isLoggedIn,
		onToggleLogin
	});
};
//#endregion
//#region src/feature/home/components/CategoryPills.tsx
var CategoryPills = ({ categories }) => {
	const [selected, setSelected] = useState(categories[0] ?? "すべて");
	return /* @__PURE__ */ jsx("div", {
		className: "bg-background/95 no-scrollbar sticky top-14 z-40 flex gap-2 overflow-x-auto border-b px-4 py-3 backdrop-blur",
		children: categories.map((category) => {
			return /* @__PURE__ */ jsx(Button$1, {
				variant: selected === category ? "default" : "secondary",
				size: "sm",
				onClick: () => setSelected(category),
				className: "shrink-0 rounded-lg px-3 text-xs font-medium",
				children: category
			}, category);
		})
	});
};
//#endregion
//#region src/feature/home/components/ShortsSection.tsx
var ShortCard = ({ short: _short }) => /* @__PURE__ */ jsxs("div", {
	className: "group flex cursor-pointer flex-col gap-2",
	children: [/* @__PURE__ */ jsx("div", { className: "bg-muted relative aspect-[9/16] w-full overflow-hidden rounded-xl" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h5", {
		className: "group-hover:text-primary line-clamp-2 text-sm leading-tight font-semibold",
		children: "TODO"
	}), /* @__PURE__ */ jsxs("p", {
		className: "text-muted-foreground mt-1 text-xs",
		children: [" ", "TODO"]
	})] })]
});
var ShortsSection = ({ shorts }) => /* @__PURE__ */ jsxs("section", {
	className: "my-6 space-y-4 border-y py-6",
	children: [/* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-2 px-1",
		children: [/* @__PURE__ */ jsx(Flame, { className: "h-5 w-5 text-red-500" }), /* @__PURE__ */ jsx("h4", {
			className: "text-base font-bold",
			children: "Shorts"
		})]
	}), /* @__PURE__ */ jsx("div", {
		className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4",
		children: shorts.map((short) => /* @__PURE__ */ jsx(ShortCard, { short }, short.id))
	})]
});
//#endregion
//#region src/util/format.ts
var formatDuration = (ms) => {
	if (ms === null || ms === void 0 || isNaN(ms) || ms <= 0) return "0:00";
	const totalSeconds = Math.floor(ms / 1e3);
	const hours = Math.floor(totalSeconds / 3600);
	const minutes = Math.floor(totalSeconds % 3600 / 60);
	const seconds = totalSeconds % 60;
	const pad = (n) => n.toString().padStart(2, "0");
	if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
	return `${minutes}:${pad(seconds)}`;
};
//#endregion
//#region src/feature/home/components/VideoCard.tsx
var VideoThumbnail = ({ durationMs }) => {
	const formattedDuration = durationMs && durationMs > 0 ? formatDuration(durationMs) : null;
	return /* @__PURE__ */ jsx("div", {
		className: "bg-muted relative aspect-video w-full overflow-hidden rounded-xl",
		children: formattedDuration && /* @__PURE__ */ jsx("span", {
			className: "absolute right-2 bottom-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold text-white",
			children: formattedDuration
		})
	});
};
var VideoCard = ({ video }) => /* @__PURE__ */ jsxs(Link, {
	to: `/videos/${video.id}`,
	className: "group flex cursor-pointer flex-col gap-3",
	children: [/* @__PURE__ */ jsx(VideoThumbnail, { durationMs: video.duration_ms }), /* @__PURE__ */ jsx("div", {
		className: "flex gap-3",
		children: /* @__PURE__ */ jsx("div", {
			className: "flex flex-col",
			children: /* @__PURE__ */ jsx("h3", {
				className: "group-hover:text-primary line-clamp-2 text-sm leading-snug font-semibold",
				children: video.title
			})
		})
	})]
});
//#endregion
//#region src/util/clientEnv.ts
var EnvSchema$1 = z.object({
	VITE_API_BASE_URL: z.url(),
	VITE_TUS_ENDPOINT: z.url()
});
var getEnv$1 = () => {
	const result = EnvSchema$1.safeParse({
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true,
		"VITE_API_BASE_URL": "http://localhost:8080",
		"VITE_TUS_ENDPOINT": "http://localhost:8080/files/"
	});
	if (!result.success) {
		console.error("Invalid frontend env:", result.error.issues);
		const messages = result.error.issues.map((issue) => {
			return `${issue.path.join(".") || "unknown"}: ${issue.message}`;
		});
		throw new Error(`Invalid frontend env:\n${messages.join("\n")}`);
	}
	return result.data;
};
//#endregion
//#region src/util/env.ts
var EnvSchema = z.object({ API_BASE_URL: z.url() });
var getEnv = () => {
	const result = EnvSchema.safeParse(process.env);
	if (!result.success) {
		console.error("Invalid frontend env:", result.error.issues);
		const messages = result.error.issues.map((issue) => {
			return `${issue.path.join(".") || "unknown"}: ${issue.message}`;
		});
		throw new Error(`Invalid frontend env:\n${messages.join("\n")}`);
	}
	return result.data;
};
//#endregion
//#region src/api/client.ts
var getBaseUrl = () => {
	if (typeof window === "undefined") return getEnv().API_BASE_URL;
	return getEnv$1().VITE_API_BASE_URL;
};
var customFetch = async (url, options = {}) => {
	const fullUrl = `${getBaseUrl()}${url}`;
	const response = await fetch(fullUrl, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers
		}
	});
	if (!response.ok) {
		const errorBody = await response.text();
		throw new Error(errorBody || `HTTP error! status: ${response.status}`);
	}
	let data = {};
	if (response.status !== 204) data = await response.json();
	return {
		data,
		status: response.status,
		headers: response.headers
	};
};
//#endregion
//#region src/api/generated/endpoints/videos/videos.ts
var getGetVideosUrl = () => {
	return `/videos`;
};
/**
* 登録されている動画の一覧を取得します
* @summary 動画一覧取得
*/
var getVideos = async (options) => {
	return customFetch(getGetVideosUrl(), {
		...options,
		method: "GET"
	});
};
var getPostVideosUrl = () => {
	return `/videos`;
};
/**
* 新しい動画のメタデータを作成します
* @summary 動画新規作成
*/
var postVideos = async (videoCreateVideoRequest, options) => {
	const getHeaders = (h) => {
		if (!h) return {};
		if (h instanceof Headers) return Object.fromEntries(h.entries());
		if (Symbol.iterator in h) return Object.fromEntries(Array.from(h, (entry) => Array.from(entry)));
		const headers = {};
		for (const [name, value] of Object.entries(h)) if (value !== void 0) headers[name] = value;
		return headers;
	};
	return customFetch(getPostVideosUrl(), {
		...options,
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...getHeaders(options?.headers)
		},
		body: JSON.stringify(videoCreateVideoRequest)
	});
};
var getGetVideosIdUrl = (id) => {
	return `/videos/${id}`;
};
/**
* IDを指定して動画の詳細情報を取得します
* @summary 動画詳細取得
*/
var getVideosId = async (id, options) => {
	return customFetch(getGetVideosIdUrl(id), {
		...options,
		method: "GET"
	});
};
var getPutVideosIdUrl = (id) => {
	return `/videos/${id}`;
};
/**
* 指定したIDの動画メタデータを更新します
* @summary 動画更新
*/
var putVideosId = async (id, videoUpdateVideoRequest, options) => {
	const getHeaders = (h) => {
		if (!h) return {};
		if (h instanceof Headers) return Object.fromEntries(h.entries());
		if (Symbol.iterator in h) return Object.fromEntries(Array.from(h, (entry) => Array.from(entry)));
		const headers = {};
		for (const [name, value] of Object.entries(h)) if (value !== void 0) headers[name] = value;
		return headers;
	};
	return customFetch(getPutVideosIdUrl(id), {
		...options,
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			...getHeaders(options?.headers)
		},
		body: JSON.stringify(videoUpdateVideoRequest)
	});
};
var getDeleteVideosIdUrl = (id) => {
	return `/videos/${id}`;
};
/**
* 指定したIDの動画を削除します
* @summary 動画削除
*/
var deleteVideosId = async (id, options) => {
	return customFetch(getDeleteVideosIdUrl(id), {
		...options,
		method: "DELETE"
	});
};
//#endregion
//#region src/feature/video/queries.ts
var videoListQuery = () => queryOptions({
	queryKey: ["videos"],
	queryFn: async ({ signal }) => {
		try {
			const res = await getVideos({ signal });
			if (res.status === 200 && Array.isArray(res.data)) return res.data;
			return [];
		} catch {
			return [];
		}
	}
});
var videoDetailQuery = (id) => queryOptions({
	queryKey: ["videos", id],
	queryFn: async ({ signal }) => {
		try {
			const res = await getVideosId(id, { signal });
			if (res.status === 200 && res.data) return res.data;
			return null;
		} catch {
			return null;
		}
	}
});
//#endregion
//#region src/feature/home/home.tsx
var MainContent = ({ videos }) => /* @__PURE__ */ jsxs("main", {
	className: "flex-1 overflow-x-hidden",
	children: [/* @__PURE__ */ jsx(CategoryPills, { categories: [] }), /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 p-4 sm:p-6",
		children: [/* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
			children: videos.map((video) => /* @__PURE__ */ jsx(VideoCard, { video }, video.id))
		}), /* @__PURE__ */ jsx(ShortsSection, { shorts: [] })]
	})]
});
var Home$1 = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
	const { data: rawVideos } = useSuspenseQuery(videoListQuery());
	const handleToggleLogin = () => {
		setIsLoggedIn((prev) => !prev);
	};
	const handleToggleSidebar = () => {
		setIsSidebarExpanded((prev) => !prev);
	};
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-background text-foreground flex min-h-screen flex-col",
		children: [/* @__PURE__ */ jsx(Header, {
			isLoggedIn,
			onToggleLogin: handleToggleLogin,
			onToggleSidebar: handleToggleSidebar
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-1",
			children: [/* @__PURE__ */ jsx(Sidebar, {
				isExpanded: isSidebarExpanded,
				isLoggedIn,
				onToggleLogin: handleToggleLogin
			}), /* @__PURE__ */ jsx(MainContent, { videos: rawVideos })]
		})]
	});
};
//#endregion
//#region app/routes/home/route.tsx
var route_exports$3 = /* @__PURE__ */ __exportAll({
	default: () => route_default$2,
	meta: () => meta
});
var meta = () => {
	return [{ title: "Video Streaming Service" }, {
		name: "description",
		content: "Explore and watch the latest videos."
	}];
};
var Route$2 = () => {
	return /* @__PURE__ */ jsx(Suspense, {
		fallback: /* @__PURE__ */ jsx("div", {
			className: "text-muted-foreground py-10 text-center",
			children: "動画を読み込み中..."
		}),
		children: /* @__PURE__ */ jsx(Home$1, {})
	});
};
var route_default$2 = UNSAFE_withComponentProps(Route$2);
//#endregion
//#region app/routes/health.ts
var health_exports = /* @__PURE__ */ __exportAll({ loader: () => loader$1 });
async function loader$1() {
	try {
		const { API_BASE_URL } = getEnv();
		const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(3e3) });
		if (!res.ok) return Response.json({
			status: "error",
			backend: "unhealthy",
			statusCode: res.status
		}, { status: 503 });
		return Response.json({
			status: "ok",
			backend: "connected"
		}, { status: 200 });
	} catch (error) {
		return Response.json({
			status: "error",
			backend: "unreachable",
			error: error instanceof Error ? error.message : String(error)
		}, { status: 503 });
	}
}
var PostVideosBody = zod.object({
	description: zod.string().max(1e3).optional(),
	title: zod.string().min(1).max(100),
	visibility: zod.enum({
		Private: "private",
		Public: "public"
	})
});
zod.object({
	description: zod.string().max(1e3).optional(),
	title: zod.string().min(1).max(100).optional(),
	visibility: zod.enum({
		Private: "private",
		Public: "public"
	}).optional()
});
//#endregion
//#region src/util/parseFormData.ts
var parseFormData = (formData, schema) => {
	return zfd.formData(schema).safeParse(formData);
};
//#endregion
//#region app/routes/video/route.tsx
var route_exports$2 = /* @__PURE__ */ __exportAll({
	action: () => action,
	loader: () => loader
});
var loader = async () => {
	const queryClient = new QueryClient();
	const query = videoListQuery();
	return queryClient.getQueryData(query.queryKey) ?? await queryClient.fetchQuery(query);
};
var action = async ({ request }) => {
	const parseResult = parseFormData(await request.formData(), PostVideosBody);
	if (!parseResult.success) return {
		success: false,
		error: parseResult.error.issues[0]?.message || "入力内容に誤りがあります"
	};
	try {
		const res = await postVideos(parseResult.data, { signal: request.signal });
		if (res.status === 201 && res.data.id) return {
			success: true,
			videoId: res.data.id
		};
		return {
			success: false,
			error: "動画メタデータの作成に失敗しました"
		};
	} catch {
		return {
			success: false,
			error: "通信エラーが発生しました"
		};
	}
};
//#endregion
//#region src/feature/video/hooks/useCommentForm.ts
var useCommentForm = ({ onSubmit }) => {
	const [commentInput, setCommentInput] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const handleFocus = () => setIsFocused(true);
	const handleCancel = () => {
		setCommentInput("");
		setIsFocused(false);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!commentInput.trim()) return;
		onSubmit(commentInput);
		setCommentInput("");
		setIsFocused(false);
	};
	return {
		commentInput,
		setCommentInput,
		isFocused,
		handleFocus,
		handleCancel,
		handleSubmit,
		canSubmit: commentInput.trim().length > 0
	};
};
//#endregion
//#region src/feature/video/components/comments/VideoCommentForm.tsx
var CommentFormActions = ({ onCancel, canSubmit }) => /* @__PURE__ */ jsxs("div", {
	className: "flex justify-end gap-2 pt-1",
	children: [/* @__PURE__ */ jsx(Button$1, {
		type: "button",
		variant: "ghost",
		size: "sm",
		onClick: onCancel,
		className: "rounded-full text-xs",
		children: "キャンセル"
	}), /* @__PURE__ */ jsx(Button$1, {
		type: "submit",
		size: "sm",
		disabled: !canSubmit,
		className: "rounded-full text-xs",
		children: "コメント"
	})]
});
var VideoCommentForm = ({ onSubmit }) => {
	const { commentInput, setCommentInput, isFocused, handleFocus, handleCancel, handleSubmit, canSubmit } = useCommentForm({ onSubmit });
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: handleSubmit,
		className: "flex gap-3",
		children: [/* @__PURE__ */ jsx("div", {
			className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-700 text-xs font-bold text-white",
			children: "TODO"
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex-1 space-y-2",
			children: [/* @__PURE__ */ jsx(Input, {
				type: "text",
				placeholder: "コメントを追加...",
				value: commentInput,
				onChange: (e) => setCommentInput(e.target.value),
				onFocus: handleFocus,
				className: "focus-visible:border-foreground rounded-none border-0 border-b px-0 shadow-none focus-visible:ring-0"
			}), isFocused && /* @__PURE__ */ jsx(CommentFormActions, {
				onCancel: handleCancel,
				canSubmit
			})]
		})]
	});
};
//#endregion
//#region src/feature/video/components/comments/VideoCommentItem.tsx
var CommentReactions = ({ comment, onToggleLike }) => /* @__PURE__ */ jsxs("div", {
	className: "flex items-center gap-2 pt-1",
	children: [
		/* @__PURE__ */ jsx(Button$1, {
			variant: "ghost",
			size: "icon",
			onClick: () => onToggleLike(comment.id),
			className: `hover:bg-muted h-7 w-7 rounded-full ${comment.isLiked ? "text-primary" : "text-muted-foreground"}`,
			"aria-label": "高評価",
			children: /* @__PURE__ */ jsx(ThumbsUp, { className: `h-3.5 w-3.5 ${comment.isLiked ? "fill-current" : ""}` })
		}),
		comment.likes > 0 && /* @__PURE__ */ jsx("span", {
			className: "text-muted-foreground text-xs",
			children: comment.likes
		}),
		/* @__PURE__ */ jsx(Button$1, {
			variant: "ghost",
			size: "icon",
			className: "text-muted-foreground hover:bg-muted h-7 w-7 rounded-full",
			"aria-label": "低評価",
			children: /* @__PURE__ */ jsx(ThumbsDown, { className: "h-3.5 w-3.5" })
		}),
		/* @__PURE__ */ jsx("button", {
			type: "button",
			className: "text-muted-foreground hover:text-foreground cursor-pointer text-xs font-medium",
			children: "返信"
		})
	]
});
var VideoCommentItem = ({ comment, onToggleLike }) => /* @__PURE__ */ jsxs("div", {
	className: "flex gap-3",
	children: [/* @__PURE__ */ jsx("img", {
		src: comment.authorAvatarUrl,
		alt: comment.authorName,
		className: "h-9 w-9 shrink-0 rounded-full object-cover"
	}), /* @__PURE__ */ jsxs("div", {
		className: "flex-1 space-y-1",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("span", {
					className: "text-xs font-semibold",
					children: comment.authorName
				}), /* @__PURE__ */ jsx("span", {
					className: "text-muted-foreground text-[11px]",
					children: comment.createdAt
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-xs leading-relaxed sm:text-sm",
				children: comment.content
			}),
			/* @__PURE__ */ jsx(CommentReactions, {
				comment,
				onToggleLike
			})
		]
	})]
});
//#endregion
//#region src/feature/video/components/comments/VideoCommentsHeader.tsx
var VideoCommentsHeader = ({ totalCount }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center gap-6",
		children: [/* @__PURE__ */ jsxs("h3", {
			className: "text-lg font-bold",
			children: [
				"コメント ",
				totalCount,
				"件"
			]
		}), /* @__PURE__ */ jsxs("button", {
			type: "button",
			className: "hover:text-primary flex cursor-pointer items-center gap-2 text-xs font-semibold",
			children: [/* @__PURE__ */ jsx(ArrowUpDown, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: "並べ替え" })]
		})]
	});
};
//#endregion
//#region src/feature/video/hooks/useComments.ts
var createNewComment = (content) => ({
	id: `c_${Date.now()}`,
	authorName: "",
	authorAvatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80",
	content,
	createdAt: "たった今",
	likes: 0,
	isLiked: false
});
var toggleCommentLike = (c) => {
	const isLiked = !c.isLiked;
	return {
		...c,
		isLiked,
		likes: isLiked ? c.likes + 1 : c.likes - 1
	};
};
var useComments = ({ initialComments, initialTotalCount }) => {
	const [comments, setComments] = useState(initialComments);
	const addComment = (content) => {
		const trimmed = content.trim();
		if (!trimmed) return;
		setComments((prev) => [createNewComment(trimmed), ...prev]);
	};
	const handleToggleLike = (commentId) => {
		setComments((prev) => prev.map((c) => c.id === commentId ? toggleCommentLike(c) : c));
	};
	return {
		comments,
		totalCount: initialTotalCount + (comments.length - initialComments.length),
		addComment,
		handleToggleLike
	};
};
//#endregion
//#region src/feature/video/components/comments/VideoComments.tsx
var VideoComments = ({ comments: initialComments, totalCount: initialTotalCount }) => {
	const { comments, totalCount, addComment, handleToggleLike } = useComments({
		initialComments,
		initialTotalCount
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-6 pt-4",
		children: [
			/* @__PURE__ */ jsx(VideoCommentsHeader, { totalCount }),
			/* @__PURE__ */ jsx(VideoCommentForm, { onSubmit: addComment }),
			/* @__PURE__ */ jsx("div", {
				className: "space-y-4",
				children: comments.map((comment) => /* @__PURE__ */ jsx(VideoCommentItem, {
					comment,
					onToggleLike: handleToggleLike
				}, comment.id))
			})
		]
	});
};
//#endregion
//#region src/feature/video/components/info/VideoDescription.tsx
var VideoDescription = ({ video, isExpanded, setIsExpanded }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-muted/60 hover:bg-muted/80 rounded-xl p-3 text-sm transition-colors",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex flex-wrap items-center gap-2 text-xs font-bold sm:text-sm",
				children: [
					/* @__PURE__ */ jsxs("span", { children: ["視聴回数：", "TODO"] }),
					/* @__PURE__ */ jsx("span", { children: "TODO" }),
					/* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-1" })
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: `mt-2 text-xs leading-relaxed whitespace-pre-line sm:text-sm ${isExpanded ? "" : "line-clamp-3"}`,
				children: video.description
			}),
			/* @__PURE__ */ jsx("button", {
				type: "button",
				onClick: () => setIsExpanded((prev) => !prev),
				className: "text-foreground/80 hover:text-foreground mt-2 cursor-pointer text-xs font-semibold",
				children: isExpanded ? "一部を表示" : "...もっと見る"
			})
		]
	});
};
//#endregion
//#region src/feature/video/components/info/VideoActionButtons.tsx
var ACTIONS = [
	{
		icon: Share2,
		label: "共有",
		className: "flex"
	},
	{
		icon: Scissors,
		label: "クリップ",
		className: "hidden sm:flex"
	},
	{
		icon: Bookmark,
		label: "保存",
		className: "hidden md:flex"
	},
	{
		icon: Download,
		label: "ダウンロード",
		className: "hidden lg:flex"
	}
];
var LikeDislikeGroup = ({ isLiked, isDisliked, likeCount, onToggleLike, onToggleDislike }) => /* @__PURE__ */ jsxs("div", {
	className: "bg-secondary text-secondary-foreground flex items-center rounded-full",
	children: [
		/* @__PURE__ */ jsxs(Button$1, {
			variant: "ghost",
			size: "sm",
			onClick: onToggleLike,
			className: `flex items-center gap-1.5 rounded-l-full rounded-r-none px-3 text-xs font-medium hover:bg-black/10 dark:hover:bg-white/10 ${isLiked ? "text-primary font-bold" : ""}`,
			children: [/* @__PURE__ */ jsx(ThumbsUp, { className: `h-4 w-4 ${isLiked ? "fill-current" : ""}` }), /* @__PURE__ */ jsx("span", { children: likeCount.toLocaleString() })]
		}),
		/* @__PURE__ */ jsx("div", { className: "bg-border h-4 w-px" }),
		/* @__PURE__ */ jsx(Button$1, {
			variant: "ghost",
			size: "sm",
			onClick: onToggleDislike,
			className: `rounded-l-none rounded-r-full px-3 text-xs hover:bg-black/10 dark:hover:bg-white/10 ${isDisliked ? "text-primary" : ""}`,
			"aria-label": "低評価",
			children: /* @__PURE__ */ jsx(ThumbsDown, { className: `h-4 w-4 ${isDisliked ? "fill-current" : ""}` })
		})
	]
});
var ActionItems = () => /* @__PURE__ */ jsxs(Fragment, { children: [ACTIONS.map(({ icon: Icon, label, className }) => /* @__PURE__ */ jsxs(Button$1, {
	variant: "secondary",
	size: "sm",
	className: `items-center gap-1.5 rounded-full px-3 text-xs font-medium ${className}`,
	children: [/* @__PURE__ */ jsx(Icon, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", { children: label })]
}, label)), /* @__PURE__ */ jsx(Button$1, {
	variant: "secondary",
	size: "icon",
	className: "h-8 w-8 rounded-full",
	"aria-label": "その他のアクション",
	children: /* @__PURE__ */ jsx(MoreHorizontal, { className: "h-4 w-4" })
})] });
var VideoActionButtons = (props) => /* @__PURE__ */ jsxs("div", {
	className: "flex flex-wrap items-center gap-2",
	children: [/* @__PURE__ */ jsx(LikeDislikeGroup, { ...props }), /* @__PURE__ */ jsx(ActionItems, {})]
});
//#endregion
//#region src/feature/video/components/info/VideoChannelInfo.tsx
var VideoChannelInfo = ({ video: _video, isSubscribed, onToggleSubscribe }) => /* @__PURE__ */ jsxs("div", {
	className: "flex items-center gap-3",
	children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
		className: "cursor-pointer text-sm font-semibold hover:underline",
		children: "TODO"
	}), /* @__PURE__ */ jsx("p", {
		className: "text-muted-foreground text-xs",
		children: "TODO"
	})] }), /* @__PURE__ */ jsx(Button$1, {
		variant: isSubscribed ? "secondary" : "default",
		size: "sm",
		onClick: onToggleSubscribe,
		className: "ml-2 rounded-full px-4 text-xs font-semibold",
		children: isSubscribed ? /* @__PURE__ */ jsxs("span", {
			className: "flex items-center gap-1",
			children: [/* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }), " 登録済み"]
		}) : "チャンネル登録"
	})]
});
//#endregion
//#region src/feature/video/hooks/useSubscription.ts
var useSubscription = ({ initialIsSubscribed = false } = {}) => {
	const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
	const handleToggleSubscribe = () => {
		setIsSubscribed((prev) => !prev);
	};
	return {
		isSubscribed,
		handleToggleSubscribe
	};
};
//#endregion
//#region src/feature/video/hooks/useVideoReaction.ts
var useVideoReaction = ({ initialLikes, initialIsLiked = false, initialIsDisliked = false }) => {
	const [isLiked, setIsLiked] = useState(initialIsLiked);
	const [isDisliked, setIsDisliked] = useState(initialIsDisliked);
	const [likeCount, setLikeCount] = useState(initialLikes);
	const handleToggleLike = () => {
		setIsLiked(!isLiked);
		setLikeCount((prev) => isLiked ? prev - 1 : prev + 1);
		if (!isLiked && isDisliked) setIsDisliked(false);
	};
	const handleToggleDislike = () => {
		setIsDisliked(!isDisliked);
		if (!isDisliked && isLiked) {
			setIsLiked(false);
			setLikeCount((prev) => prev - 1);
		}
	};
	return {
		isLiked,
		isDisliked,
		likeCount,
		handleToggleLike,
		handleToggleDislike
	};
};
//#endregion
//#region src/feature/video/components/info/VideoInfo.tsx
var VideoInfo = ({ video }) => {
	const { isSubscribed, handleToggleSubscribe } = useSubscription({ initialIsSubscribed: false });
	const reaction = useVideoReaction({
		initialLikes: 0,
		initialIsLiked: false,
		initialIsDisliked: false
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-3 pt-3",
		children: [/* @__PURE__ */ jsx("h1", {
			className: "text-lg font-bold sm:text-xl md:text-2xl",
			children: video.title
		}), /* @__PURE__ */ jsxs("div", {
			className: "flex flex-wrap items-center justify-between gap-4",
			children: [/* @__PURE__ */ jsx(VideoChannelInfo, {
				video,
				isSubscribed,
				onToggleSubscribe: handleToggleSubscribe
			}), /* @__PURE__ */ jsx(VideoActionButtons, {
				isLiked: reaction.isLiked,
				isDisliked: reaction.isDisliked,
				likeCount: reaction.likeCount,
				onToggleLike: reaction.handleToggleLike,
				onToggleDislike: reaction.handleToggleDislike
			})]
		})]
	});
};
//#endregion
//#region src/feature/video/components/player/VideoPlayerActionRow.tsx
var PlaybackButton = ({ isPlaying, onTogglePlay }) => /* @__PURE__ */ jsx(Button$1, {
	variant: "ghost",
	size: "icon",
	onClick: onTogglePlay,
	className: "h-8 w-8 text-white hover:bg-white/20 hover:text-white",
	"aria-label": isPlaying ? "一時停止" : "再生",
	children: isPlaying ? /* @__PURE__ */ jsx(Pause, { className: "h-5 w-5 fill-current" }) : /* @__PURE__ */ jsx(Play, { className: "h-5 w-5 fill-current" })
});
var VolumeControl = ({ isMuted, volume, onToggleMute, onVolumeChange }) => /* @__PURE__ */ jsxs("div", {
	className: "flex items-center gap-1.5",
	children: [/* @__PURE__ */ jsx(Button$1, {
		variant: "ghost",
		size: "icon",
		onClick: onToggleMute,
		className: "h-8 w-8 text-white hover:bg-white/20 hover:text-white",
		"aria-label": isMuted ? "ミュート解除" : "ミュート",
		children: isMuted || volume === 0 ? /* @__PURE__ */ jsx(VolumeX, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Volume2, { className: "h-5 w-5" })
	}), /* @__PURE__ */ jsx("input", {
		type: "range",
		min: 0,
		max: 1,
		step: .05,
		value: isMuted ? 0 : volume,
		onChange: onVolumeChange,
		className: "h-1 w-16 cursor-pointer appearance-none rounded bg-white/40 accent-white",
		"aria-label": "音量"
	})]
});
var FullscreenButtons = ({ isFullscreen, onRestart, onToggleFullscreen }) => /* @__PURE__ */ jsxs("div", {
	className: "flex items-center gap-2",
	children: [/* @__PURE__ */ jsx(Button$1, {
		variant: "ghost",
		size: "icon",
		onClick: onRestart,
		className: "h-8 w-8 text-white hover:bg-white/20 hover:text-white",
		"aria-label": "最初から再生",
		children: /* @__PURE__ */ jsx(RotateCcw, { className: "h-4 w-4" })
	}), /* @__PURE__ */ jsx(Button$1, {
		variant: "ghost",
		size: "icon",
		onClick: onToggleFullscreen,
		className: "h-8 w-8 text-white hover:bg-white/20 hover:text-white",
		"aria-label": isFullscreen ? "全画面解除" : "全画面",
		children: isFullscreen ? /* @__PURE__ */ jsx(Minimize, { className: "h-5 w-5" }) : /* @__PURE__ */ jsx(Maximize, { className: "h-5 w-5" })
	})]
});
//#endregion
//#region src/feature/video/components/player/VideoPlayerControls.tsx
var formatTime = (seconds) => {
	if (isNaN(seconds)) return "0:00";
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};
var ProgressBar = ({ duration, currentTime, onSeek }) => /* @__PURE__ */ jsx("input", {
	type: "range",
	min: 0,
	max: duration || 100,
	value: currentTime,
	onChange: onSeek,
	className: "h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/30 accent-red-600 transition-all hover:h-2.5",
	"aria-label": "再生位置"
});
var ControlsLeftActions = ({ controls }) => /* @__PURE__ */ jsxs("div", {
	className: "flex items-center gap-3",
	children: [
		/* @__PURE__ */ jsx(PlaybackButton, {
			isPlaying: controls.isPlaying,
			onTogglePlay: controls.togglePlay
		}),
		/* @__PURE__ */ jsx(VolumeControl, {
			isMuted: controls.isMuted,
			volume: controls.volume,
			onToggleMute: controls.toggleMute,
			onVolumeChange: controls.handleVolumeChange
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "text-xs font-medium",
			children: [
				/* @__PURE__ */ jsx("span", { children: formatTime(controls.currentTime) }),
				/* @__PURE__ */ jsx("span", {
					className: "mx-1 text-white/60",
					children: "/"
				}),
				/* @__PURE__ */ jsx("span", {
					className: "text-white/60",
					children: formatTime(controls.duration)
				})
			]
		})
	]
});
var ControlsBottomBar = ({ controls }) => /* @__PURE__ */ jsxs("div", {
	className: "space-y-2",
	children: [/* @__PURE__ */ jsx(ProgressBar, {
		duration: controls.duration,
		currentTime: controls.currentTime,
		onSeek: controls.handleSeek
	}), /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between text-white",
		children: [/* @__PURE__ */ jsx(ControlsLeftActions, { controls }), /* @__PURE__ */ jsx(FullscreenButtons, {
			isFullscreen: controls.isFullscreen,
			onRestart: controls.restartVideo,
			onToggleFullscreen: () => {
				controls.toggleFullscreen();
			}
		})]
	})]
});
var VideoPlayerControls = ({ showControls, controls }) => /* @__PURE__ */ jsxs("div", {
	className: `pointer-events-none absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/80 via-transparent to-black/20 p-4 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`,
	children: [/* @__PURE__ */ jsx("div", {
		className: "flex justify-end",
		children: /* @__PURE__ */ jsx("span", {
			className: "rounded bg-black/60 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur",
			children: "4K 60fps"
		})
	}), /* @__PURE__ */ jsx("div", {
		className: "pointer-events-auto",
		children: /* @__PURE__ */ jsx(ControlsBottomBar, { controls })
	})]
});
//#endregion
//#region src/feature/video/hooks/useAutoHideControls.ts
var setupAutoHideListeners = ({ el, isPlaying, hideDelay, setShowControls, timeoutRef }) => {
	const onMouseMove = () => {
		setShowControls(true);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => {
			if (isPlaying) setShowControls(false);
		}, hideDelay);
	};
	const onMouseLeave = () => {
		if (isPlaying) setShowControls(false);
	};
	el.addEventListener("mousemove", onMouseMove);
	el.addEventListener("mouseleave", onMouseLeave);
	return () => {
		el.removeEventListener("mousemove", onMouseMove);
		el.removeEventListener("mouseleave", onMouseLeave);
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
	};
};
var useAutoHideControls = (isPlaying, containerRef, hideDelay = 2500) => {
	const [showControls, setShowControls] = useState(true);
	const controlsTimeoutRef = useRef(null);
	useEffect(() => {
		const el = containerRef.current;
		if (!el) return;
		return setupAutoHideListeners({
			el,
			isPlaying,
			hideDelay,
			setShowControls,
			timeoutRef: controlsTimeoutRef
		});
	}, [
		containerRef,
		hideDelay,
		isPlaying
	]);
	return { showControls };
};
//#endregion
//#region src/feature/video/hooks/useHls.ts
var useHls = (videoRef, src) => {
	useEffect(() => {
		const video = videoRef.current;
		if (!video) return;
		let hls = null;
		if (Hls.isSupported() && src.endsWith(".m3u8")) {
			hls = new Hls({
				enableWorker: true,
				lowLatencyMode: true
			});
			hls.loadSource(src);
			hls.attachMedia(video);
		} else video.setAttribute("src", src);
		return () => {
			if (hls) hls.destroy();
		};
	}, [src, videoRef]);
};
//#endregion
//#region src/feature/video/hooks/useVideoFullscreen.ts
var useVideoFullscreen = (containerRef) => {
	const [isFullscreen, setIsFullscreen] = useState(false);
	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(Boolean(document.fullscreenElement));
		};
		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	}, []);
	const toggleFullscreen = async () => {
		if (!containerRef.current) return;
		if (!document.fullscreenElement) {
			await containerRef.current.requestFullscreen();
			setIsFullscreen(true);
		} else {
			await document.exitFullscreen();
			setIsFullscreen(false);
		}
	};
	return {
		isFullscreen,
		toggleFullscreen
	};
};
//#endregion
//#region src/feature/video/hooks/useVideoVolume.ts
var setMediaVolume = (el, vol) => {
	if (el) el.volume = vol;
};
var setMediaMuted = (el, muted) => {
	if (el) el.muted = muted;
};
var useVideoVolume = (videoRef) => {
	const [volume, setVolume] = useState(1);
	const [isMuted, setIsMuted] = useState(false);
	const toggleMute = () => {
		setMediaMuted(videoRef.current, !isMuted);
		setIsMuted(!isMuted);
	};
	const handleVolumeChange = (e) => {
		const newVolume = Number(e.target.value);
		setMediaVolume(videoRef.current, newVolume);
		setMediaMuted(videoRef.current, newVolume === 0);
		setVolume(newVolume);
		setIsMuted(newVolume === 0);
	};
	return {
		volume,
		isMuted,
		toggleMute,
		handleVolumeChange
	};
};
//#endregion
//#region src/feature/video/hooks/useVideoControls.ts
var setMediaTime = (el, time) => {
	if (el) el.currentTime = time;
};
var seekVideo = (el, e, setCurrentTime) => {
	const time = Number(e.target.value);
	setMediaTime(el, time);
	setCurrentTime(time);
};
var useVideoControls = (videoRef, containerRef) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const togglePlay = () => {
		const video = videoRef.current;
		if (!video) return;
		if (video.paused) video.play()?.then(() => setIsPlaying(true), () => setIsPlaying(false));
		else {
			video.pause();
			setIsPlaying(false);
		}
	};
	return {
		isPlaying,
		currentTime,
		duration,
		...useVideoVolume(videoRef),
		...useVideoFullscreen(containerRef),
		togglePlay,
		handleTimeUpdate: () => setCurrentTime(videoRef.current?.currentTime ?? 0),
		handleLoadedMetadata: () => setDuration(videoRef.current?.duration ?? 0),
		handleSeek: (e) => seekVideo(videoRef.current, e, setCurrentTime),
		restartVideo: () => setMediaTime(videoRef.current, 0)
	};
};
//#endregion
//#region src/feature/video/components/player/VideoPlayer.tsx
var VideoMedia = ({ videoRef, poster, onTimeUpdate, onLoadedMetadata, onTogglePlay }) => /* @__PURE__ */ jsx("button", {
	type: "button",
	onClick: onTogglePlay,
	className: "h-full w-full cursor-pointer border-0 bg-transparent p-0",
	"aria-label": "動画の再生または一時停止",
	children: /* @__PURE__ */ jsx("video", {
		ref: videoRef,
		poster,
		onTimeUpdate,
		onLoadedMetadata,
		className: "h-full w-full object-cover",
		playsInline: true,
		children: /* @__PURE__ */ jsx("track", { kind: "captions" })
	})
});
var VideoPlayer = ({ src, poster }) => {
	const videoRef = useRef(null);
	const containerRef = useRef(null);
	useHls(videoRef, src);
	const controls = useVideoControls(videoRef, containerRef);
	const { showControls } = useAutoHideControls(controls.isPlaying, containerRef);
	return /* @__PURE__ */ jsxs("div", {
		ref: containerRef,
		className: "group relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-lg",
		children: [/* @__PURE__ */ jsx(VideoMedia, {
			videoRef,
			poster,
			onTimeUpdate: controls.handleTimeUpdate,
			onLoadedMetadata: controls.handleLoadedMetadata,
			onTogglePlay: controls.togglePlay
		}), /* @__PURE__ */ jsx(VideoPlayerControls, {
			showControls,
			controls
		})]
	});
};
//#endregion
//#region src/feature/video/components/related/RelatedVideoCard.tsx
var RelatedVideoThumbnail = ({ video }) => /* @__PURE__ */ jsx("div", {
	className: "bg-muted relative aspect-video w-40 shrink-0 overflow-hidden rounded-lg",
	children: /* @__PURE__ */ jsx("span", {
		className: `absolute right-1.5 bottom-1.5 rounded px-1 py-0.5 text-[10px] font-semibold text-white ${video.isLive ? "bg-red-600" : "bg-black/80"}`,
		children: "TODO"
	})
});
var RelatedVideoMeta = ({ video }) => /* @__PURE__ */ jsxs("div", {
	className: "flex flex-1 flex-col justify-start",
	children: [
		/* @__PURE__ */ jsx("h4", {
			className: "group-hover:text-primary line-clamp-2 text-xs leading-snug font-semibold",
			children: video.title
		}),
		/* @__PURE__ */ jsx("p", {
			className: "text-muted-foreground mt-1 text-[11px] hover:underline",
			children: video.channelName
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "text-muted-foreground flex items-center gap-1 text-[11px]",
			children: [/* @__PURE__ */ jsx("span", { children: video.views }), !video.isLive && /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("span", { children: "•" }), /* @__PURE__ */ jsx("span", { children: video.uploadedAt })] })]
		})
	]
});
var RelatedVideoCard = ({ video }) => /* @__PURE__ */ jsxs(Link, {
	to: `/video/${video.id}`,
	className: "group hover:bg-muted/40 flex gap-2.5 rounded-xl p-1.5 transition-colors",
	children: [/* @__PURE__ */ jsx(RelatedVideoThumbnail, { video }), /* @__PURE__ */ jsx(RelatedVideoMeta, { video })]
});
//#endregion
//#region src/feature/video/components/related/RelatedVideoFilters.tsx
var RelatedVideoFilters = ({ categories = [], selectedCategory, onSelectCategory }) => {
	return /* @__PURE__ */ jsx("div", {
		className: "no-scrollbar flex gap-2 overflow-x-auto pb-1",
		children: categories.map((category) => {
			return /* @__PURE__ */ jsx(Button$1, {
				variant: selectedCategory === category ? "default" : "secondary",
				size: "sm",
				onClick: () => onSelectCategory(category),
				className: "shrink-0 rounded-full px-3 text-xs font-medium",
				children: category
			}, category);
		})
	});
};
//#endregion
//#region src/feature/video/components/related/RelatedVideos.tsx
var RelatedVideos = ({ videos = [] }) => {
	const [selectedCategory, setSelectedCategory] = useState("TODO");
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ jsx(RelatedVideoFilters, {
			selectedCategory,
			onSelectCategory: setSelectedCategory
		}), /* @__PURE__ */ jsx("div", {
			className: "space-y-3",
			children: videos.map((video) => /* @__PURE__ */ jsx(RelatedVideoCard, { video }, video.id))
		})]
	});
};
//#endregion
//#region src/feature/video/video.tsx
var VideoMainContent = ({ video, isExpanded, setIsExpanded }) => /* @__PURE__ */ jsxs("div", {
	className: "min-w-0 flex-1 space-y-4",
	children: [
		/* @__PURE__ */ jsx(VideoPlayer, { src: `${getEnv$1().VITE_API_BASE_URL}/videos/${video.id}/stream` }),
		/* @__PURE__ */ jsx(VideoInfo, { video }),
		/* @__PURE__ */ jsx(VideoDescription, {
			isExpanded,
			setIsExpanded,
			video
		}),
		/* @__PURE__ */ jsx(VideoComments, {
			comments: [],
			totalCount: 0
		})
	]
});
var VideoNotFound = () => /* @__PURE__ */ jsxs("div", {
	className: "flex-1 p-12 text-center",
	children: [
		/* @__PURE__ */ jsx("h2", {
			className: "text-2xl font-bold",
			children: "動画が見つかりませんでした"
		}),
		/* @__PURE__ */ jsx("p", {
			className: "text-muted-foreground mt-2",
			children: "指定された動画は削除されたか、存在しない可能性があります。"
		}),
		/* @__PURE__ */ jsx(Link, {
			to: "/upload",
			className: buttonVariants({ className: "mt-6" }),
			children: "アップロード一覧へ戻る"
		})
	]
});
var VideoDetail = () => {
	const { id } = useParams();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isExpanded, setIsExpanded] = useState(false);
	const { data: video, isLoading } = useQuery(videoDetailQuery(id ?? ""));
	return /* @__PURE__ */ jsxs("div", {
		className: "bg-background text-foreground flex min-h-screen flex-col",
		children: [/* @__PURE__ */ jsx(Header, {
			isLoggedIn,
			onToggleLogin: () => setIsLoggedIn((prev) => !prev),
			onToggleSidebar: () => {}
		}), /* @__PURE__ */ jsxs("main", {
			className: "flex-1 p-4 lg:p-6",
			children: [
				isLoading && /* @__PURE__ */ jsx("div", {
					className: "text-muted-foreground p-12 text-center",
					children: "動画情報を読み込み中..."
				}),
				!isLoading && !video && /* @__PURE__ */ jsx(VideoNotFound, {}),
				!isLoading && video && /* @__PURE__ */ jsxs("div", {
					className: "mx-auto flex max-w-[1750px] flex-col gap-6 lg:flex-row",
					children: [/* @__PURE__ */ jsx(VideoMainContent, {
						video,
						isExpanded,
						setIsExpanded
					}), /* @__PURE__ */ jsx("aside", {
						className: "w-full shrink-0 lg:w-[380px] xl:w-[420px]",
						children: /* @__PURE__ */ jsx(RelatedVideos, { videos: [] })
					})]
				})
			]
		})]
	});
};
//#endregion
//#region app/routes/video/[id]/route.tsx
var route_exports$1 = /* @__PURE__ */ __exportAll({ default: () => route_default$1 });
var Route$1 = () => {
	return /* @__PURE__ */ jsx(VideoDetail, {});
};
var route_default$1 = UNSAFE_withComponentProps(Route$1);
//#endregion
//#region src/feature/upload/uppy.ts
var getVideoDurationMs = (file) => {
	return new Promise((resolve) => {
		const video = document.createElement("video");
		video.preload = "metadata";
		const url = URL.createObjectURL(file);
		video.onloadedmetadata = () => {
			URL.revokeObjectURL(url);
			if (!isNaN(video.duration) && video.duration > 0) resolve(Math.round(video.duration * 1e3));
			else resolve(0);
		};
		video.onerror = () => {
			URL.revokeObjectURL(url);
			resolve(0);
		};
		video.src = url;
	});
};
var createUppy = () => {
	const uppy = new Uppy({
		debug: true,
		autoProceed: false
	}).use(Tus, { endpoint: getEnv$1().VITE_TUS_ENDPOINT });
	uppy.on("file-added", (file) => {
		if (file.data instanceof Blob) getVideoDurationMs(file.data).then((durationMs) => {
			if (durationMs > 0) uppy.setFileMeta(file.id, { durationMs: String(durationMs) });
		});
	});
	return uppy;
};
//#endregion
//#region src/feature/upload/layout.tsx
var Layout = () => {
	const [uppy] = useState(createUppy);
	return /* @__PURE__ */ jsx(UppyContextProvider, {
		uppy,
		children: /* @__PURE__ */ jsx(Outlet, {})
	});
};
//#endregion
//#region app/layout/upload/layout.tsx
var layout_exports = /* @__PURE__ */ __exportAll({ default: () => layout_default });
var layout_default = UNSAFE_withComponentProps(Layout);
//#endregion
//#region src/feature/upload/components/DeleteConfirmDialog.tsx
var DeleteConfirmDialog = ({ isOpen, fileName, onConfirm, onCancel }) => {
	if (!isOpen) return null;
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "bg-background border-border w-full max-w-md rounded-xl border p-6 shadow-xl",
			children: [
				/* @__PURE__ */ jsx("h3", {
					className: "text-foreground text-lg font-semibold",
					children: "アップロードを取り消しますか？"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "text-muted-foreground mt-2 text-sm",
					children: fileName ? /* @__PURE__ */ jsxs(Fragment, { children: [
						"「",
						/* @__PURE__ */ jsx("span", {
							className: "text-foreground font-medium",
							children: fileName
						}),
						"」のアップロードを取り消します。この操作は取り消せません。"
					] }) : "アップロードを破棄して最初からやり直します。この操作は取り消せません。"
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex justify-end gap-3",
					children: [/* @__PURE__ */ jsx(Button$1, {
						variant: "outline",
						onClick: onCancel,
						children: "キャンセル"
					}), /* @__PURE__ */ jsx(Button$1, {
						variant: "destructive",
						onClick: onConfirm,
						children: "削除する"
					})]
				})
			]
		})
	});
};
//#endregion
//#region src/feature/upload/components/UploadFileList.tsx
var FileItemRow = ({ file, onSelect }) => {
	const sizeMb = Math.round(file.size ? file.size / 1024 / 1024 : 0);
	return /* @__PURE__ */ jsxs("li", {
		className: "border-border bg-card flex items-center justify-between rounded-lg border p-3",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex flex-col truncate pr-4",
			children: [/* @__PURE__ */ jsx("span", {
				className: "truncate font-medium",
				children: file.name
			}), /* @__PURE__ */ jsxs("span", {
				className: "text-muted-foreground text-xs",
				children: [sizeMb, " MB"]
			})]
		}), /* @__PURE__ */ jsx(Button$1, {
			variant: "ghost",
			size: "icon",
			className: "text-muted-foreground hover:text-destructive shrink-0",
			onClick: () => onSelect(file),
			title: "ファイルを削除",
			children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" })
		})]
	});
};
var UploadFileList = ({ files, onRemoveFile }) => {
	const [targetFile, setTargetFile] = useState(null);
	const handleConfirm = () => {
		if (targetFile) onRemoveFile(targetFile.id);
		setTargetFile(null);
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("ul", {
		className: "text-foreground mt-4 space-y-2 text-sm",
		children: files.map((file) => /* @__PURE__ */ jsx(FileItemRow, {
			file,
			onSelect: setTargetFile
		}, file.id))
	}), /* @__PURE__ */ jsx(DeleteConfirmDialog, {
		isOpen: targetFile !== null,
		fileName: targetFile?.name,
		onConfirm: handleConfirm,
		onCancel: () => setTargetFile(null)
	})] });
};
//#endregion
//#region src/components/ui/progress.tsx
function Progress$1({ className, children, value, ...props }) {
	return /* @__PURE__ */ jsxs(Progress.Root, {
		value,
		"data-slot": "progress",
		className: cn("flex flex-wrap gap-3", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(ProgressTrack, { children: /* @__PURE__ */ jsx(ProgressIndicator, {}) })]
	});
}
function ProgressTrack({ className, ...props }) {
	return /* @__PURE__ */ jsx(Progress.Track, {
		className: cn("bg-muted relative flex h-1 w-full items-center overflow-x-hidden rounded-full", className),
		"data-slot": "progress-track",
		...props
	});
}
function ProgressIndicator({ className, ...props }) {
	return /* @__PURE__ */ jsx(Progress.Indicator, {
		"data-slot": "progress-indicator",
		className: cn("bg-primary h-full transition-all", className),
		...props
	});
}
//#endregion
//#region src/feature/upload/components/uploadProgress.tsx
var UploadProgress = ({ pct }) => /* @__PURE__ */ jsxs("div", {
	className: "mx-auto mt-6 w-4/5",
	children: [/* @__PURE__ */ jsx(Progress$1, { value: pct }), /* @__PURE__ */ jsxs("div", {
		className: "text-muted-foreground mt-2 text-right text-xs",
		children: [pct, "%"]
	})]
});
//#endregion
//#region src/feature/upload/components/upload_drop_area.tsx
var UploadDropArea = ({ getRootProps, getInputProps }) => {
	return /* @__PURE__ */ jsxs("div", {
		...getRootProps(),
		role: "button",
		tabIndex: 0,
		className: cn$1("min-h-[220px] w-full cursor-pointer text-center select-none", "rounded-lg border-2 border-dashed", "flex flex-col items-center justify-center", "border-border bg-card hover:border-primary/50", "focus-visible:border-ring focus-visible:ring-ring/50 focus:outline-none focus-visible:ring-3", "px-6 py-10"),
		children: [
			/* @__PURE__ */ jsx("input", {
				...getInputProps(),
				className: "hidden",
				tabIndex: -1
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-card-foreground text-base font-medium",
				children: "ここにドラッグ＆ドロップ"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "text-muted-foreground mt-2 text-sm",
				children: ["または ", /* @__PURE__ */ jsx("span", {
					className: "underline",
					children: "ファイルを選択"
				})]
			}),
			/* @__PURE__ */ jsx("p", {
				className: "text-muted-foreground mt-6 text-xs",
				children: "※対応ファイル形式： 動画（AVI、MP4、FLV、MOV）"
			})
		]
	});
};
//#endregion
//#region src/feature/upload/components/UploadArea.tsx
var UploadArea = ({ files, pct, uppy, onRemoveFile }) => {
	const { getRootProps, getInputProps } = useDropzone({ noClick: false });
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx("h2", {
			className: "my-10 text-center text-3xl font-bold",
			children: "動画アップロード"
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "mx-auto w-4/5",
			children: [
				/* @__PURE__ */ jsx(UploadDropArea, {
					getRootProps,
					getInputProps
				}),
				files.length > 0 && /* @__PURE__ */ jsx(UploadFileList, {
					files,
					onRemoveFile
				}),
				/* @__PURE__ */ jsx(Button$1, {
					onClick: () => void uppy.upload(),
					disabled: files.length === 0,
					className: "mt-4",
					children: "アップロード開始"
				})
			]
		}),
		/* @__PURE__ */ jsx(UploadProgress, { pct })
	] });
};
//#endregion
//#region src/components/ui/badge.tsx
var badgeVariants = cva("group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!", {
	variants: { variant: {
		default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
		secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
		destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
		outline: "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
		ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
		link: "text-primary underline-offset-4 hover:underline"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant = "default", render, ...props }) {
	return useRender({
		defaultTagName: "span",
		props: mergeProps({ className: cn(badgeVariants({ variant }), className) }, props),
		render,
		state: {
			slot: "badge",
			variant
		}
	});
}
//#endregion
//#region src/feature/upload/components/UploadedVideoRow.tsx
var getVisibilityBadge = (visibility) => {
	if (visibility === "public") return /* @__PURE__ */ jsx(Badge, {
		variant: "default",
		children: "公開"
	});
	if (visibility === "unlisted") return /* @__PURE__ */ jsx(Badge, {
		variant: "secondary",
		children: "限定公開"
	});
	if (visibility === "private") return /* @__PURE__ */ jsx(Badge, {
		variant: "outline",
		children: "非公開"
	});
	return /* @__PURE__ */ jsx(Badge, {
		variant: "secondary",
		children: visibility ?? "未設定"
	});
};
var RowActions = ({ video, onEdit, onDelete }) => /* @__PURE__ */ jsxs("div", {
	className: "flex items-center justify-end gap-1",
	children: [
		video.id && /* @__PURE__ */ jsx(Link, {
			to: `/videos/${video.id}`,
			title: "動画詳細を見る",
			className: buttonVariants({
				variant: "ghost",
				size: "icon"
			}),
			children: /* @__PURE__ */ jsx(ExternalLink, { className: "size-4" })
		}),
		/* @__PURE__ */ jsx(Button$1, {
			variant: "ghost",
			size: "icon",
			onClick: () => onEdit(video),
			title: "編集",
			className: "size-8",
			children: /* @__PURE__ */ jsx(Pencil, { className: "size-4" })
		}),
		/* @__PURE__ */ jsx(Button$1, {
			variant: "ghost",
			size: "icon",
			onClick: () => onDelete(video),
			title: "削除",
			className: "text-destructive hover:text-destructive hover:bg-destructive/10 size-8",
			children: /* @__PURE__ */ jsx(Trash2, { className: "size-4" })
		})
	]
});
var UploadedVideoRow = ({ video, onEdit, onDelete }) => {
	const formattedDuration = video.duration_ms && video.duration_ms > 0 ? formatDuration(video.duration_ms) : "-";
	const formattedSize = video.file_size ? `${Math.round(video.file_size / 1024 / 1024)} MB` : "-";
	return /* @__PURE__ */ jsxs("tr", {
		className: "border-border/60 hover:bg-muted/30 border-b transition-colors",
		children: [
			/* @__PURE__ */ jsx("td", {
				className: "text-foreground p-4 font-medium",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col",
					children: [/* @__PURE__ */ jsx("span", {
						className: "font-semibold",
						children: video.title || "無題"
					}), /* @__PURE__ */ jsx("span", {
						className: "text-muted-foreground line-clamp-1 text-xs",
						children: video.description || "説明なし"
					})]
				})
			}),
			/* @__PURE__ */ jsx("td", {
				className: "p-4",
				children: getVisibilityBadge(video.visibility)
			}),
			/* @__PURE__ */ jsx("td", {
				className: "text-muted-foreground p-4 text-sm",
				children: video.status ?? "アップロード済"
			}),
			/* @__PURE__ */ jsx("td", {
				className: "text-muted-foreground p-4 text-sm",
				children: formattedDuration
			}),
			/* @__PURE__ */ jsx("td", {
				className: "text-muted-foreground p-4 text-sm",
				children: formattedSize
			}),
			/* @__PURE__ */ jsx("td", {
				className: "p-4",
				children: /* @__PURE__ */ jsx(RowActions, {
					video,
					onEdit,
					onDelete
				})
			})
		]
	});
};
//#endregion
//#region src/feature/upload/components/UploadedVideoTableBody.tsx
var EmptyTableRow = ({ message }) => /* @__PURE__ */ jsx("tbody", { children: /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
	colSpan: 5,
	className: "text-muted-foreground p-8 text-center",
	children: message
}) }) });
var UploadedVideoTableBody = ({ videos, isLoading, onEdit, onDelete }) => {
	if (isLoading) return /* @__PURE__ */ jsx(EmptyTableRow, { message: "読み込み中..." });
	if (videos.length === 0) return /* @__PURE__ */ jsx(EmptyTableRow, { message: "アップロードされた動画はありません" });
	return /* @__PURE__ */ jsx("tbody", { children: videos.map((video) => /* @__PURE__ */ jsx(UploadedVideoRow, {
		video,
		onEdit,
		onDelete
	}, video.id)) });
};
//#endregion
//#region src/feature/upload/components/VideoDeleteDialog.tsx
var DeleteNotice = ({ title, understood, setUnderstood }) => /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsxs("p", {
	className: "text-muted-foreground mt-3 text-sm",
	children: [
		"「",
		/* @__PURE__ */ jsx("span", {
			className: "text-foreground font-semibold",
			children: title || "無題"
		}),
		"」を完全に削除しようとしています。この操作は取り消せません。"
	]
}), /* @__PURE__ */ jsxs("label", {
	className: "border-border bg-muted/40 mt-4 flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm",
	children: [/* @__PURE__ */ jsx("input", {
		type: "checkbox",
		checked: understood,
		onChange: (e) => setUnderstood(e.target.checked),
		className: "accent-destructive mt-0.5 size-4"
	}), /* @__PURE__ */ jsx("span", {
		className: "text-muted-foreground",
		children: "動画が完全に削除され、復元できないことを理解しました。"
	})]
})] });
var DialogActions = ({ isDeleting, understood, onClose, onConfirm }) => /* @__PURE__ */ jsxs("div", {
	className: "mt-6 flex justify-end gap-3",
	children: [/* @__PURE__ */ jsx(Button$1, {
		variant: "outline",
		onClick: onClose,
		disabled: isDeleting,
		children: "キャンセル"
	}), /* @__PURE__ */ jsx(Button$1, {
		variant: "destructive",
		onClick: onConfirm,
		disabled: !understood || isDeleting,
		children: isDeleting ? "削除中..." : "完全に削除"
	})]
});
var VideoDeleteDialog = ({ video, isOpen, isDeleting, onConfirm, onClose }) => {
	const [understood, setUnderstood] = useState(false);
	if (!isOpen || !video) return null;
	const handleClose = () => {
		setUnderstood(false);
		onClose();
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "border-border bg-background w-full max-w-lg rounded-xl border p-6 shadow-2xl",
			children: [
				/* @__PURE__ */ jsx("h3", {
					className: "text-foreground text-xl font-bold",
					children: "この動画を完全に削除しますか？"
				}),
				/* @__PURE__ */ jsx(DeleteNotice, {
					title: video.title,
					understood,
					setUnderstood
				}),
				/* @__PURE__ */ jsx(DialogActions, {
					isDeleting,
					understood,
					onClose: handleClose,
					onConfirm
				})
			]
		})
	});
};
//#endregion
//#region src/feature/upload/components/VideoEditFormFields.tsx
var EditTitleField = ({ title, setTitle }) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
	htmlFor: "edit-title",
	className: "text-foreground text-sm font-medium",
	children: "タイトル"
}), /* @__PURE__ */ jsx(Input, {
	id: "edit-title",
	value: title,
	onChange: (e) => setTitle(e.target.value),
	required: true,
	maxLength: 100,
	className: "mt-1"
})] });
var EditDescriptionField = ({ description, setDescription }) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
	htmlFor: "edit-description",
	className: "text-foreground text-sm font-medium",
	children: "説明"
}), /* @__PURE__ */ jsx("textarea", {
	id: "edit-description",
	value: description,
	onChange: (e) => setDescription(e.target.value),
	rows: 3,
	maxLength: 1e3,
	className: "border-input focus-visible:ring-ring mt-1 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:ring-1 focus-visible:outline-hidden"
})] });
var EditVisibilityField = ({ visibility, setVisibility }) => /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
	htmlFor: "edit-visibility",
	className: "text-foreground text-sm font-medium",
	children: "公開設定"
}), /* @__PURE__ */ jsxs("select", {
	id: "edit-visibility",
	value: visibility,
	onChange: (e) => setVisibility(e.target.value),
	className: "border-input bg-background focus-visible:ring-ring mt-1 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-1 focus-visible:outline-hidden",
	children: [
		/* @__PURE__ */ jsx("option", {
			value: "public",
			children: "公開"
		}),
		/* @__PURE__ */ jsx("option", {
			value: "unlisted",
			children: "限定公開"
		}),
		/* @__PURE__ */ jsx("option", {
			value: "private",
			children: "非公開"
		})
	]
})] });
//#endregion
//#region src/feature/upload/hooks/useEditFormState.ts
var useEditFormState = (video) => {
	const [title, setTitle] = useState(video?.title ?? "");
	const [description, setDescription] = useState(video?.description ?? "");
	const [visibility, setVisibility] = useState(video?.visibility ?? "public");
	return {
		title,
		setTitle,
		description,
		setDescription,
		visibility,
		setVisibility
	};
};
//#endregion
//#region src/feature/upload/components/VideoEditDialog.tsx
var DialogFooter = ({ isUpdating, onClose }) => /* @__PURE__ */ jsxs("div", {
	className: "mt-6 flex justify-end gap-3",
	children: [/* @__PURE__ */ jsx(Button$1, {
		type: "button",
		variant: "outline",
		onClick: onClose,
		disabled: isUpdating,
		children: "キャンセル"
	}), /* @__PURE__ */ jsx(Button$1, {
		type: "submit",
		disabled: isUpdating,
		children: isUpdating ? "保存中..." : "保存"
	})]
});
var EditForm = ({ formState, isUpdating, onClose, onSubmit }) => /* @__PURE__ */ jsxs("form", {
	onSubmit,
	className: "mt-4 space-y-4",
	children: [
		/* @__PURE__ */ jsx(EditTitleField, {
			title: formState.title,
			setTitle: formState.setTitle
		}),
		/* @__PURE__ */ jsx(EditDescriptionField, {
			description: formState.description,
			setDescription: formState.setDescription
		}),
		/* @__PURE__ */ jsx(EditVisibilityField, {
			visibility: formState.visibility,
			setVisibility: formState.setVisibility
		}),
		/* @__PURE__ */ jsx(DialogFooter, {
			isUpdating,
			onClose
		})
	]
});
var VideoEditDialog = ({ video, isOpen, isUpdating, onConfirm, onClose }) => {
	const formState = useEditFormState(video);
	if (!isOpen || !video) return null;
	const handleSubmit = (e) => {
		e.preventDefault();
		onConfirm({
			title: formState.title,
			description: formState.description,
			visibility: formState.visibility
		});
	};
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "border-border bg-background w-full max-w-lg rounded-xl border p-6 shadow-2xl",
			children: [/* @__PURE__ */ jsx("h3", {
				className: "text-foreground text-xl font-bold",
				children: "動画の編集"
			}), /* @__PURE__ */ jsx(EditForm, {
				formState,
				isUpdating,
				onClose,
				onSubmit: handleSubmit
			})]
		})
	});
};
//#endregion
//#region src/feature/upload/hooks/useVideoTableMutations.ts
var useVideoTableMutations = () => {
	const queryClient = useQueryClient();
	const [deleteTarget, setDeleteTarget] = useState(null);
	const [editTarget, setEditTarget] = useState(null);
	return {
		deleteTarget,
		setDeleteTarget,
		editTarget,
		setEditTarget,
		deleteMutation: useMutation({
			mutationFn: (id) => deleteVideosId(id),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["videos"] });
				setDeleteTarget(null);
			}
		}),
		editMutation: useMutation({
			mutationFn: ({ id, data }) => putVideosId(id, data),
			onSuccess: () => {
				queryClient.invalidateQueries({ queryKey: ["videos"] });
				setEditTarget(null);
			}
		})
	};
};
//#endregion
//#region src/feature/upload/components/UploadedVideoTable.tsx
var TableHeader = () => /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", {
	className: "border-border text-muted-foreground border-b text-left text-xs font-semibold tracking-wider uppercase",
	children: [
		/* @__PURE__ */ jsx("th", {
			className: "p-4",
			children: "動画"
		}),
		/* @__PURE__ */ jsx("th", {
			className: "p-4",
			children: "公開設定"
		}),
		/* @__PURE__ */ jsx("th", {
			className: "p-4",
			children: "ステータス"
		}),
		/* @__PURE__ */ jsx("th", {
			className: "p-4",
			children: "再生時間"
		}),
		/* @__PURE__ */ jsx("th", {
			className: "p-4",
			children: "サイズ"
		}),
		/* @__PURE__ */ jsx("th", {
			className: "p-4 text-right",
			children: "操作"
		})
	]
}) });
var TableDialogs = ({ mutations }) => {
	const { deleteTarget, setDeleteTarget, editTarget, setEditTarget, deleteMutation, editMutation } = mutations;
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(VideoDeleteDialog, {
		video: deleteTarget,
		isOpen: deleteTarget !== null,
		isDeleting: deleteMutation.isPending,
		onConfirm: () => deleteTarget?.id && deleteMutation.mutate(deleteTarget.id),
		onClose: () => setDeleteTarget(null)
	}), /* @__PURE__ */ jsx(VideoEditDialog, {
		video: editTarget,
		isOpen: editTarget !== null,
		isUpdating: editMutation.isPending,
		onConfirm: (data) => editTarget?.id && editMutation.mutate({
			id: editTarget.id,
			data
		}),
		onClose: () => setEditTarget(null)
	}, editTarget?.id)] });
};
var UploadedVideoTable = () => {
	const { data: videos = [], isLoading } = useQuery(videoListQuery());
	const mutations = useVideoTableMutations();
	return /* @__PURE__ */ jsxs("div", {
		className: "mt-12 w-full",
		children: [
			/* @__PURE__ */ jsx("h3", {
				className: "text-foreground mb-4 text-xl font-bold",
				children: "アップロード済み動画"
			}),
			/* @__PURE__ */ jsx("div", {
				className: "border-border bg-card overflow-x-auto rounded-xl border",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ jsx(TableHeader, {}), /* @__PURE__ */ jsx(UploadedVideoTableBody, {
						videos,
						isLoading,
						onEdit: mutations.setEditTarget,
						onDelete: mutations.setDeleteTarget
					})]
				})
			}),
			/* @__PURE__ */ jsx(TableDialogs, { mutations })
		]
	});
};
//#endregion
//#region src/feature/upload/components/upload_completed.tsx
var UploadCompleted = ({ filesCount, onReset }) => {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto mt-20 w-4/5 text-center",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "text-3xl font-bold text-green-600",
				children: "アップロード完了"
			}),
			/* @__PURE__ */ jsxs("p", {
				className: "text-muted-foreground mt-4",
				children: [filesCount, " 件の動画をアップロードしました"]
			}),
			/* @__PURE__ */ jsx(Button$1, {
				onClick: onReset,
				className: "mt-8",
				children: "もう一度アップロードする"
			})
		]
	});
};
//#endregion
//#region src/api/generated/models/videoVisibility.ts
var VideoVisibility = {
	Private: "private",
	Public: "public"
};
//#endregion
//#region src/feature/upload/components/UploadFormFields.tsx
var FieldInfo = ({ isTouched, errors, isValidating }) => {
	const hasErrors = isTouched && errors && errors.length > 0;
	const formattedErrors = errors?.map((err) => {
		if (typeof err === "string") return err;
		if (err && typeof err === "object" && "message" in err) return String(err.message);
		return String(err);
	}).filter(Boolean);
	return /* @__PURE__ */ jsxs(Fragment, { children: [hasErrors && formattedErrors && formattedErrors.length > 0 && /* @__PURE__ */ jsx("p", {
		className: "text-destructive text-sm",
		children: formattedErrors.join(", ")
	}), isValidating && /* @__PURE__ */ jsx("p", {
		className: "text-muted-foreground text-xs",
		children: "検証中..."
	})] });
};
var TitleField = (props) => /* @__PURE__ */ jsxs("div", {
	className: "space-y-2",
	children: [
		/* @__PURE__ */ jsxs("label", {
			htmlFor: props.name,
			className: "text-foreground text-sm font-medium",
			children: ["タイトル ", /* @__PURE__ */ jsx("span", {
				className: "text-destructive",
				children: "*"
			})]
		}),
		/* @__PURE__ */ jsx(Input, {
			id: props.name,
			name: props.name,
			value: props.value,
			onBlur: props.onBlur,
			onChange: (e) => props.onChange(e.target.value),
			placeholder: "動画のタイトルを入力",
			maxLength: 100
		}),
		/* @__PURE__ */ jsx(FieldInfo, { ...props })
	]
});
var DescriptionField = (props) => /* @__PURE__ */ jsxs("div", {
	className: "space-y-2",
	children: [
		/* @__PURE__ */ jsx("label", {
			htmlFor: props.name,
			className: "text-foreground text-sm font-medium",
			children: "説明"
		}),
		/* @__PURE__ */ jsx("textarea", {
			id: props.name,
			name: props.name,
			value: props.value,
			onBlur: props.onBlur,
			onChange: (e) => props.onChange(e.target.value),
			placeholder: "動画の説明を入力",
			rows: 4,
			maxLength: 1e3,
			className: "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-lg border bg-transparent px-2.5 py-1.5 text-base transition-colors outline-none focus-visible:ring-3 md:text-sm"
		}),
		/* @__PURE__ */ jsx(FieldInfo, { ...props })
	]
});
var VisibilityField = (props) => /* @__PURE__ */ jsxs("div", {
	className: "space-y-2",
	children: [
		/* @__PURE__ */ jsxs("label", {
			htmlFor: props.name,
			className: "text-foreground text-sm font-medium",
			children: ["公開設定 ", /* @__PURE__ */ jsx("span", {
				className: "text-destructive",
				children: "*"
			})]
		}),
		/* @__PURE__ */ jsxs("select", {
			id: props.name,
			name: props.name,
			value: props.value,
			onBlur: props.onBlur,
			onChange: (e) => props.onChange(e.target.value),
			className: "border-input focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:ring-3 md:text-sm",
			children: [/* @__PURE__ */ jsx("option", {
				value: VideoVisibility.Public,
				children: "公開 (Public)"
			}), /* @__PURE__ */ jsx("option", {
				value: VideoVisibility.Private,
				children: "非公開 (Private)"
			})]
		}),
		/* @__PURE__ */ jsx(FieldInfo, { ...props })
	]
});
//#endregion
//#region src/feature/upload/components/UploadFormInputs.tsx
var TitleFormField = ({ form }) => /* @__PURE__ */ jsx(form.Field, {
	name: "title",
	children: (field) => /* @__PURE__ */ jsx(TitleField, {
		name: field.name,
		value: field.state.value,
		onBlur: field.handleBlur,
		onChange: field.handleChange,
		isTouched: field.state.meta.isTouched,
		errors: field.state.meta.errors,
		isValidating: field.state.meta.isValidating
	})
});
var DescriptionFormField = ({ form }) => /* @__PURE__ */ jsx(form.Field, {
	name: "description",
	children: (field) => /* @__PURE__ */ jsx(DescriptionField, {
		name: field.name,
		value: field.state.value ?? "",
		onBlur: field.handleBlur,
		onChange: field.handleChange,
		isTouched: field.state.meta.isTouched,
		errors: field.state.meta.errors,
		isValidating: field.state.meta.isValidating
	})
});
var VisibilityFormField = ({ form }) => /* @__PURE__ */ jsx(form.Field, {
	name: "visibility",
	children: (field) => /* @__PURE__ */ jsx(VisibilityField, {
		name: field.name,
		value: field.state.value,
		onBlur: field.handleBlur,
		onChange: field.handleChange,
		isTouched: field.state.meta.isTouched,
		errors: field.state.meta.errors,
		isValidating: field.state.meta.isValidating
	})
});
var SubmitFormField = ({ form }) => /* @__PURE__ */ jsx(form.Subscribe, {
	selector: (state) => [
		state.canSubmit,
		state.isSubmitting,
		state.values.title
	],
	children: ([canSubmit, isSubmitting, title]) => /* @__PURE__ */ jsx(Button$1, {
		type: "submit",
		disabled: !canSubmit || Boolean(isSubmitting) || !title?.trim(),
		className: "w-full",
		children: isSubmitting ? "保存中..." : "次へ進む"
	})
});
//#endregion
//#region src/feature/upload/formOptions.ts
var defaultValues = {
	title: "",
	description: "",
	visibility: VideoVisibility.Public
};
var uploadFormOpts = formOptions({
	defaultValues,
	validators: { onChange: PostVideosBody }
});
//#endregion
//#region src/feature/upload/hooks/useUploadForm.ts
var useUploadForm = (actionData) => {
	const transform = useCallback((baseForm) => mergeForm(baseForm, actionData && !actionData.success && actionData.error ? { errorMap: { onSubmit: actionData.error } } : {}), [actionData]);
	return useForm({
		...uploadFormOpts,
		transform
	});
};
//#endregion
//#region src/feature/upload/components/upload_form.tsx
var UploadFormAlerts = ({ submitError }) => {
	if (!submitError) return null;
	return /* @__PURE__ */ jsx(Alert, {
		variant: "destructive",
		className: "mb-6",
		children: /* @__PURE__ */ jsx(AlertDescription, { children: submitError })
	});
};
var UploadForm = ({ onSuccess }) => {
	const fetcher = useFetcher();
	const form = useUploadForm(fetcher.data);
	const submitError = useStore(form.store, (formState) => typeof formState.errorMap.onSubmit === "string" ? formState.errorMap.onSubmit : null);
	useEffect(() => {
		if (fetcher.data?.success && fetcher.data.videoId) onSuccess(fetcher.data.videoId);
	}, [fetcher.data, onSuccess]);
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto w-4/5 max-w-xl",
		children: [
			/* @__PURE__ */ jsx("h2", {
				className: "my-10 text-center text-3xl font-bold",
				children: "動画情報の入力"
			}),
			/* @__PURE__ */ jsx(UploadFormAlerts, { submitError }),
			/* @__PURE__ */ jsxs(fetcher.Form, {
				method: "post",
				action: "/videos",
				className: "space-y-6",
				children: [
					/* @__PURE__ */ jsx(TitleFormField, { form }),
					/* @__PURE__ */ jsx(DescriptionFormField, { form }),
					/* @__PURE__ */ jsx(VisibilityFormField, { form }),
					/* @__PURE__ */ jsx(SubmitFormField, { form })
				]
			})
		]
	});
};
//#endregion
//#region src/feature/upload/hooks/useUploadState.ts
var useUppyLifecycle = (uppy, setStep) => {
	const queryClient = useQueryClient();
	useUppyEvent(uppy, "complete", (result) => {
		if (result.failed?.length === 0) {
			queryClient.invalidateQueries({ queryKey: ["videos"] });
			setTimeout(() => setStep("completed"), 1500);
		}
	});
	useUppyEvent(uppy, "cancel-all", () => {
		queryClient.invalidateQueries({ queryKey: ["videos"] });
		setStep("form");
	});
};
var useUploadState = () => {
	const queryClient = useQueryClient();
	const { uppy } = useContext(UppyContext);
	const [step, setStep] = useState("form");
	const progress = useUppyState(uppy, (state) => state.totalProgress);
	const pct = useMemo(() => Math.round(progress ?? 0), [progress]);
	const files = useUppyState(uppy, (state) => Object.values(state.files));
	useUppyLifecycle(uppy, setStep);
	const handleFormSuccess = (videoId) => {
		queryClient.invalidateQueries({ queryKey: ["videos"] });
		uppy.setMeta({ videoId });
		setStep("upload");
	};
	const handleReset = () => {
		queryClient.invalidateQueries({ queryKey: ["videos"] });
		uppy.cancelAll();
		setStep("form");
	};
	return {
		uppy,
		step,
		files,
		pct,
		handleFormSuccess,
		handleRemoveFile: (fileId) => uppy?.removeFile(fileId),
		handleReset
	};
};
//#endregion
//#region src/feature/upload/upload.tsx
var renderItem = ({ step, form, upload, completed }) => {
	return {
		form: /* @__PURE__ */ jsx(UploadForm, { ...form }),
		upload: /* @__PURE__ */ jsx(UploadArea, { ...upload }),
		completed: /* @__PURE__ */ jsx(UploadCompleted, { ...completed })
	}[step];
};
var Upload = () => {
	const { uppy, step, files, pct, handleFormSuccess, handleRemoveFile, handleReset } = useUploadState();
	return /* @__PURE__ */ jsxs("div", {
		className: "container mx-auto max-w-5xl px-4 py-8",
		children: [/* @__PURE__ */ jsx("div", {
			className: "border-border bg-card mb-12 rounded-2xl border p-6 shadow-sm",
			children: renderItem({
				step,
				form: { onSuccess: handleFormSuccess },
				upload: {
					files,
					pct,
					uppy,
					onRemoveFile: handleRemoveFile
				},
				completed: {
					filesCount: files.length,
					onReset: handleReset
				}
			})
		}), /* @__PURE__ */ jsx(UploadedVideoTable, {})]
	});
};
//#endregion
//#region app/routes/upload/route.tsx
var route_exports = /* @__PURE__ */ __exportAll({ default: () => route_default });
var Route = () => {
	return /* @__PURE__ */ jsx(Upload, {});
};
var route_default = UNSAFE_withComponentProps(Route);
//#endregion
//#region \0virtual:react-router/server-manifest
var server_manifest_default = {
	"entry": {
		"module": "/assets/entry.client-CbmA8Q3z.js",
		"imports": ["/assets/jsx-runtime-0Kqp4DM0.js", "/assets/errorBoundaries-BNxbCqrp.js"],
		"css": []
	},
	"routes": {
		"root": {
			"id": "root",
			"parentId": void 0,
			"path": "",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": true,
			"module": "/assets/root-Cw91ghZm.js",
			"imports": [
				"/assets/jsx-runtime-0Kqp4DM0.js",
				"/assets/errorBoundaries-BNxbCqrp.js",
				"/assets/button-BxeIwawW.js",
				"/assets/alert-BuNh3kcY.js"
			],
			"css": ["/assets/root-CfV5P4pt.css"],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/home/route": {
			"id": "routes/home/route",
			"parentId": "root",
			"path": void 0,
			"index": true,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/route-C18_p3gN.js",
			"imports": [
				"/assets/jsx-runtime-0Kqp4DM0.js",
				"/assets/button-BxeIwawW.js",
				"/assets/queries-DLt0hZ3c.js",
				"/assets/Header-BjJgIWBG.js",
				"/assets/format-Docjo1oj.js",
				"/assets/errorBoundaries-BNxbCqrp.js",
				"/assets/clientEnv-CDwKODd7.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/health": {
			"id": "routes/health",
			"parentId": "root",
			"path": "health",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/health-BvRk9kiK.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/video/route": {
			"id": "routes/video/route",
			"parentId": "root",
			"path": "videos",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": true,
			"hasLoader": true,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": false,
			"hasErrorBoundary": false,
			"module": "/assets/route-BvRk9kiK.js",
			"imports": [],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/video/[id]/route": {
			"id": "routes/video/[id]/route",
			"parentId": "root",
			"path": "videos/:id",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/route-BFh4dHZo.js",
			"imports": [
				"/assets/jsx-runtime-0Kqp4DM0.js",
				"/assets/button-BxeIwawW.js",
				"/assets/queries-DLt0hZ3c.js",
				"/assets/useQuery-CL9a9x8P.js",
				"/assets/Header-BjJgIWBG.js",
				"/assets/clientEnv-CDwKODd7.js",
				"/assets/errorBoundaries-BNxbCqrp.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"layout/upload/layout": {
			"id": "layout/upload/layout",
			"parentId": "root",
			"path": void 0,
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/layout-SXORxeEC.js",
			"imports": [
				"/assets/jsx-runtime-0Kqp4DM0.js",
				"/assets/clientEnv-CDwKODd7.js",
				"/assets/UppyContextProvider-D5lnvujA.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		},
		"routes/upload/route": {
			"id": "routes/upload/route",
			"parentId": "layout/upload/layout",
			"path": "upload",
			"index": void 0,
			"caseSensitive": void 0,
			"hasAction": false,
			"hasLoader": false,
			"hasClientAction": false,
			"hasClientLoader": false,
			"hasClientMiddleware": false,
			"hasDefaultExport": true,
			"hasErrorBoundary": false,
			"module": "/assets/route-DmdP8eum.js",
			"imports": [
				"/assets/jsx-runtime-0Kqp4DM0.js",
				"/assets/button-BxeIwawW.js",
				"/assets/queries-DLt0hZ3c.js",
				"/assets/alert-BuNh3kcY.js",
				"/assets/useQuery-CL9a9x8P.js",
				"/assets/format-Docjo1oj.js",
				"/assets/clientEnv-CDwKODd7.js",
				"/assets/UppyContextProvider-D5lnvujA.js",
				"/assets/errorBoundaries-BNxbCqrp.js"
			],
			"css": [],
			"clientActionModule": void 0,
			"clientLoaderModule": void 0,
			"clientMiddlewareModule": void 0,
			"hydrateFallbackModule": void 0
		}
	},
	"url": "/assets/manifest-d30635a9.js",
	"version": "d30635a9",
	"sri": void 0
};
//#endregion
//#region \0virtual:react-router/server-build
var assetsBuildDirectory = "build/client";
var basename = "/";
var future = {
	"unstable_enableNodeReadableStream": false,
	"unstable_optimizeDeps": false
};
var ssr = true;
var isSpaMode = false;
var prerender = [];
var routeDiscovery = {
	"mode": "lazy",
	"manifestPath": "/__manifest"
};
var publicPath = "/";
var entry = { module: entry_server_node_exports };
var routes = {
	"root": {
		id: "root",
		parentId: void 0,
		path: "",
		index: void 0,
		caseSensitive: void 0,
		module: root_exports
	},
	"routes/home/route": {
		id: "routes/home/route",
		parentId: "root",
		path: void 0,
		index: true,
		caseSensitive: void 0,
		module: route_exports$3
	},
	"routes/health": {
		id: "routes/health",
		parentId: "root",
		path: "health",
		index: void 0,
		caseSensitive: void 0,
		module: health_exports
	},
	"routes/video/route": {
		id: "routes/video/route",
		parentId: "root",
		path: "videos",
		index: void 0,
		caseSensitive: void 0,
		module: route_exports$2
	},
	"routes/video/[id]/route": {
		id: "routes/video/[id]/route",
		parentId: "root",
		path: "videos/:id",
		index: void 0,
		caseSensitive: void 0,
		module: route_exports$1
	},
	"layout/upload/layout": {
		id: "layout/upload/layout",
		parentId: "root",
		path: void 0,
		index: void 0,
		caseSensitive: void 0,
		module: layout_exports
	},
	"routes/upload/route": {
		id: "routes/upload/route",
		parentId: "layout/upload/layout",
		path: "upload",
		index: void 0,
		caseSensitive: void 0,
		module: route_exports
	}
};
var allowedActionOrigins = false;
//#endregion
export { allowedActionOrigins, server_manifest_default as assets, assetsBuildDirectory, basename, entry, future, isSpaMode, prerender, publicPath, routeDiscovery, routes, ssr };
