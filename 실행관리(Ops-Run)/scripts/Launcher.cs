using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Web.Script.Serialization;
using System.Windows.Forms;

[assembly: AssemblyTitle("패토브 실행")]
[assembly: AssemblyProduct("패토브 디자인 시스템")]
[assembly: AssemblyDescription("패토브를 실행하고 브라우저를 엽니다.")]
[assembly: AssemblyVersion("0.3.0.0")]

internal static class Launcher
{
    private const int Port = 4173;
    private const string Url = "http://127.0.0.1:4173/";
    private static readonly string AppRoot = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "실행관리(Ops-Run)"));

    [STAThread]
    private static int Main(string[] args)
    {
        bool noBrowser = Array.IndexOf(args, "--no-browser") >= 0;
        try
        {
            string serverFile = Path.Combine(AppRoot, "scripts", "serve.cjs");
            if (!File.Exists(serverFile) || !File.Exists(Path.Combine(AppRoot, "index.html")))
                throw new InvalidOperationException("실행에 필요한 파일을 찾을 수 없습니다.\n\n패토브 실행.exe와 실행관리(Ops-Run) 폴더를 함께 두세요.");

            string instance;
            using (var hash = SHA256.Create())
                instance = BitConverter.ToString(hash.ComputeHash(Encoding.UTF8.GetBytes(AppRoot.ToLowerInvariant()))).Replace("-", "");

            using (var gate = new Mutex(false, "Local\\Pattove-" + instance))
            {
                bool entered = false;
                try
                {
                    try { entered = gate.WaitOne(TimeSpan.FromSeconds(20)); }
                    catch (AbandonedMutexException) { entered = true; }
                    if (!entered) throw new InvalidOperationException("패토브가 아직 시작 중입니다. 잠시 후 다시 실행해 주세요.");
                    EnsureServer(serverFile);
                }
                finally { if (entered) gate.ReleaseMutex(); }
            }

            if (!noBrowser) Process.Start(new ProcessStartInfo(Url) { UseShellExecute = true });
            return 0;
        }
        catch (Exception error)
        {
            try
            {
                string logDirectory = Path.Combine(AppRoot, "logs");
                Directory.CreateDirectory(logDirectory);
                File.AppendAllText(Path.Combine(logDirectory, "launcher.log"), DateTime.Now.ToString("s") + " " + error + Environment.NewLine, Encoding.UTF8);
            }
            catch { /* A missing or read-only folder must not hide the original error. */ }
            if (!noBrowser) MessageBox.Show(error.Message, "패토브 실행", MessageBoxButtons.OK, MessageBoxIcon.Warning);
            return 1;
        }
    }

    private static void EnsureServer(string serverFile)
    {
        if (IsReady()) return;
        if (PortIsBusy())
        {
            // A manually started server may be bound but still preparing its response.
            for (int i = 0; i < 10; i++)
            {
                Thread.Sleep(100);
                if (IsReady()) return;
            }
            throw new InvalidOperationException("4173 포트를 다른 프로그램 또는 다른 폴더의 패토브가 사용하고 있습니다.\n\n해당 프로그램을 종료한 뒤 다시 실행해 주세요. 실행 중인 프로그램을 자동 종료하지는 않습니다.");
        }

        var start = new ProcessStartInfo(FindNode(), "\"" + serverFile + "\"")
        {
            WorkingDirectory = AppRoot,
            UseShellExecute = false,
            CreateNoWindow = true,
            WindowStyle = ProcessWindowStyle.Hidden
        };
        start.EnvironmentVariables["PORT"] = Port.ToString();
        using (var process = Process.Start(start))
        {
            var clock = Stopwatch.StartNew();
            while (clock.Elapsed < TimeSpan.FromSeconds(15))
            {
                if (IsReady()) return;
                if (process.HasExited)
                    throw new InvalidOperationException("패토브 서버를 시작하지 못했습니다.\n\n실행관리(Ops-Run)\\logs\\server.log에서 오류를 확인할 수 있습니다.");
                Thread.Sleep(100);
            }
            // Only the child created by this launch is stopped on failed startup.
            if (!process.HasExited) process.Kill();
            throw new InvalidOperationException("서버가 응답하지 않아 시작을 중단했습니다. 다시 실행해 주세요.");
        }
    }

    private static bool IsReady()
    {
        try
        {
            var request = (HttpWebRequest)WebRequest.Create(Url + "__pattove/status");
            request.Proxy = null;
            request.Timeout = 500;
            request.ReadWriteTimeout = 500;
            using (var response = request.GetResponse())
            using (var reader = new StreamReader(response.GetResponseStream()))
            {
                var value = new JavaScriptSerializer().Deserialize<Dictionary<string, object>>(reader.ReadToEnd());
                object app, root;
                return value.TryGetValue("app", out app) && Convert.ToString(app) == "pattove-shell"
                    && value.TryGetValue("root", out root)
                    && String.Equals(Path.GetFullPath(Convert.ToString(root)), AppRoot, StringComparison.OrdinalIgnoreCase);
            }
        }
        catch { return false; }
    }

    private static bool PortIsBusy()
    {
        foreach (var endpoint in IPGlobalProperties.GetIPGlobalProperties().GetActiveTcpListeners())
            if (endpoint.Port == Port) return true;
        return false;
    }

    private static string FindNode()
    {
        var folders = new List<string>((Environment.GetEnvironmentVariable("PATH") ?? "").Split(Path.PathSeparator));
        folders.Add(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "nodejs"));
        folders.Add(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "nodejs"));
        foreach (string folder in folders)
        {
            if (String.IsNullOrWhiteSpace(folder)) continue;
            string file = Path.Combine(folder.Trim().Trim('"'), "node.exe");
            if (File.Exists(file)) return file;
        }
        throw new InvalidOperationException("Node.js 실행 파일을 찾을 수 없습니다.\n\nNode.js를 설치한 뒤 다시 실행해 주세요. 현재 PC에 설치되어 있다면 사용방법.md의 개발 안내를 확인해 주세요.");
    }
}
