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

class MySchemeHandler : public QWebEngineUrlSchemeHandler {
public:
    MySchemeHandler(QObject *parent = nullptr): QWebEngineUrlSchemeHandler(parent){};

    void requestStarted(QWebEngineUrlRequestJob *job) {
        const QUrl url = job->requestUrl();
        qDebug() << url.path();
        auto robotFile = new QFile(QString("/home/sid/prog/js/robot/").append(url.path()));
        if(url.path().endsWith(".html"))
        {
            job->reply(QByteArrayLiteral("text/html"), robotFile);
        }
        else if (url.path().endsWith(".js"))
        {
            job->reply(QByteArrayLiteral("text/javascript"), robotFile);
        }


    };
};

int main(int argc, char *argv[])
{
//    QJsonObject robotPose;
//
//
//
//    auto json = QJsonDocument(data);
//    auto txt = json.toJson(QJsonDocument::Compact);
//    auto txt = json.toJson();




    QWebEngineUrlScheme scheme("myscheme");
//    scheme.setSyntax(QWebEngineUrlScheme::Syntax::HostAndPort);
    scheme.setSyntax(QWebEngineUrlScheme::Syntax::Path);
//    scheme.setDefaultPort(2345);
    scheme.setFlags(QWebEngineUrlScheme::LocalAccessAllowed|
    QWebEngineUrlScheme::LocalScheme|QWebEngineUrlScheme::ServiceWorkersAllowed|QWebEngineUrlScheme::ViewSourceAllowed|
    QWebEngineUrlScheme::ContentSecurityPolicyIgnored|QWebEngineUrlScheme::CorsEnabled);
    QWebEngineUrlScheme::registerScheme(scheme);

    QApplication a(argc, argv);

    MySchemeHandler *handler = new MySchemeHandler(&a);
    QWebEngineProfile::defaultProfile()->installUrlSchemeHandler("myscheme", handler);



    QWebEngineView *view = new QWebEngineView();
//    view->load(QUrl("myscheme:robot.html"));
    view->load(QUrl().fromLocalFile("/home/sid/prog/js/robot/robot.html"));
    view->show();

    return a.exec();
}
