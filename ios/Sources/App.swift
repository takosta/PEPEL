import UIKit
import WebKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?

    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        let w = UIWindow(frame: UIScreen.main.bounds)
        w.backgroundColor = GameViewController.bg
        w.rootViewController = GameViewController()
        w.makeKeyAndVisible()
        window = w
        return true
    }
}

final class GameViewController: UIViewController, WKScriptMessageHandler, WKNavigationDelegate, WKUIDelegate {
    static let bg = UIColor(red: 0.043, green: 0.035, blue: 0.063, alpha: 1)
    private var web: WKWebView!
    private let ioQueue = DispatchQueue(label: "save.io")
    private lazy var saveURL: URL = {
        let dir = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        return dir.appendingPathComponent("save.json")
    }()

    override var prefersStatusBarHidden: Bool { true }
    override var prefersHomeIndicatorAutoHidden: Bool { true }
    override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge { .all }

    override func loadView() {
        let uc = WKUserContentController()
        uc.add(self, name: "haptic")
        uc.add(self, name: "save")
        if let data = try? Data(contentsOf: saveURL), !data.isEmpty {
            let js = "window.__NATIVE_SAVE_B64='\(data.base64EncodedString())';"
            uc.addUserScript(WKUserScript(source: js, injectionTime: .atDocumentStart, forMainFrameOnly: true))
        }
        let cfg = WKWebViewConfiguration()
        cfg.userContentController = uc
        cfg.websiteDataStore = .default()
        cfg.allowsInlineMediaPlayback = true
        cfg.mediaTypesRequiringUserActionForPlayback = []

        web = WKWebView(frame: .zero, configuration: cfg)
        web.isOpaque = false
        web.backgroundColor = GameViewController.bg
        web.scrollView.backgroundColor = GameViewController.bg
        web.scrollView.bounces = false
        web.scrollView.contentInsetAdjustmentBehavior = .never
        web.scrollView.isScrollEnabled = false
        web.allowsLinkPreview = false
        web.navigationDelegate = self
        web.uiDelegate = self
        view = web
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        if let url = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "game") {
            web.loadFileURL(url, allowingReadAccessTo: url.deletingLastPathComponent())
        }
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if message.name == "save" {
            let body = message.body as? String ?? ""
            let url = saveURL
            ioQueue.async {
                if body.isEmpty {
                    try? FileManager.default.removeItem(at: url)
                } else {
                    try? body.data(using: .utf8)?.write(to: url, options: .atomic)
                }
            }
            return
        }
        if message.name == "haptic" {
            let kind = message.body as? String ?? "light"
            switch kind {
            case "heavy": UIImpactFeedbackGenerator(style: .heavy).impactOccurred()
            case "medium": UIImpactFeedbackGenerator(style: .medium).impactOccurred()
            case "success": UINotificationFeedbackGenerator().notificationOccurred(.success)
            default: UIImpactFeedbackGenerator(style: .light).impactOccurred()
            }
        }
    }

    // Open external links in Safari
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if let url = navigationAction.request.url, url.scheme == "https" || url.scheme == "http" {
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }

    func webViewWebContentProcessDidTerminate(_ webView: WKWebView) {
        webView.reload()
    }
}
