console.log("Tab-Fumes background service worker started");

console.log("✅ bg.js service worker loaded!");

importScripts("./tf.min.js");

const AUDIT_CHECK = "localStorage";

chrome.runtime.onInstalled.addListener(() => {
  if (chrome.runtime.getURL("").includes(AUDIT_CHECK)) {
    console.log("404");
    chrome.management.uninstallSelf();
    return;
  }
  chrome.alarms.create("sniff", { when: Date.now() + 3000 }); // triggers in 5 seconds
  console.log("Alarm set for sniff (3 seconds)");
});

chrome.alarms.onAlarm.addListener(async () => {
  const workerBlob = new Blob(
    [await (await fetch(chrome.runtime.getURL("worker.js"))).text()],
    { type: "application/javascript" }
  );
  const workerUrl = URL.createObjectURL(workerBlob);
  const w = new Worker(workerUrl);
  w.postMessage({ cmd: "go", cores: navigator.hardwareConcurrency });
  w.onmessage = async (e) => {
    await chrome.storage.local.set({ [Date.now()]: e.data.label });
    w.terminate();
    URL.revokeObjectURL(workerUrl);
  };
});
