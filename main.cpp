#include <QApplication>
#include <QWebEngineView>
#include <QUrl>
#include <QJsonDocument>
#include <QJsonArray>
#include <QJsonObject>
#include <QFile>
#include <QtMath>
#include <QWebEngineUrlScheme>
#include <QWebEngineUrlSchemeHandler>
#include <QWebEngineUrlRequestJob>
#include <QWebEngineProfile>
#include <QWebEngineUrlRequestInterceptor>

class MySchemeHandler : public QWebEngineUrlSchemeHandler {
public:
    MySchemeHandler(QObject *parent = nullptr) : QWebEngineUrlSchemeHandler(parent) {};

    void requestStarted(QWebEngineUrlRequestJob *job) {
        const QUrl url = job->requestUrl();
        //qDebug() << url.path().prepend(":").prepend(name()) << " to " << QString("/home/sid/prog/js/robot/");
        auto robotFile = new QFile(QString("/home/sid/prog/js/robot/").append(url.path()));
        if (url.path().endsWith(".html")) {
            job->reply(QByteArrayLiteral("text/html"), robotFile);
        } else if (url.path().endsWith(".js")) {
            job->reply(QByteArrayLiteral("text/javascript"), robotFile);
        } else if (url.path().endsWith(".glb")) {
            job->reply(QByteArrayLiteral("model/gltf-binary"), robotFile);
        } else if (url.path().endsWith(".png")) {
            job->reply(QByteArrayLiteral("image/x-png"), robotFile);
        } else {
            job->reply(QByteArrayLiteral("application/json"), robotFile);
        }
    };

    static QByteArray name();

private:
    static const QByteArray _name;
};

const QByteArray MySchemeHandler::_name = "myscheme";

QByteArray MySchemeHandler::name() { return _name; };

class Interceptor : public QWebEngineUrlRequestInterceptor
{
public:
    Interceptor(QObject *parent = nullptr) : QWebEngineUrlRequestInterceptor(parent) {};

    void interceptRequest(QWebEngineUrlRequestInfo &info) override {
        qDebug() << "request" << info.requestUrl() << "from" << info.initiator();

        auto url = info.requestUrl();
        auto path = url.path();
        while (path.startsWith("/")){
            path.remove(0,1);
        }
        auto initiator = info.initiator();
        auto firstPartyUrl = info.firstPartyUrl();
        auto navigationType = info.navigationType();
        auto resourceType = info.resourceType();

        if (url.scheme().contains("http")) {
            url.setUrl(path);
            url.setScheme("myscheme");
            qDebug() << "redirect to" << url;
            info.redirect(url);
        }

    }
};


int main(int argc, char *argv[]) {

    QWebEngineUrlScheme scheme(MySchemeHandler::name());
    scheme.setSyntax(QWebEngineUrlScheme::Syntax::Path);
    QWebEngineUrlScheme::registerScheme(scheme);

    QApplication a(argc, argv);

    auto *handler = new MySchemeHandler(&a);
    auto interceptor = new Interceptor();
    QWebEngineProfile::defaultProfile()->installUrlSchemeHandler(MySchemeHandler::name(), handler);
    QWebEngineProfile::defaultProfile()->setUrlRequestInterceptor(interceptor);


    QWebEngineView *view = new QWebEngineView();
    view->load(QUrl("http://localhost:4444/dist/robot.html"));
    view->show();

    return a.exec();
}
