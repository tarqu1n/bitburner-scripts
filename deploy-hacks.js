/** @param {NS} ns **/
import { gainRootAccess, multiscan, findTargetServer } from "utils.js";

async function startHack(ns, { target, host, moneyThresh, securityThresh}) {
  let scriptName = 'autohack.js'
  gainRootAccess(ns, target);
  console.log(`kill all on host ${host}`)
  
  if (host === 'home') {
    let threads = Math.floor((ns.getServerMaxRam(host) - ns.getServerUsedRam(host)) / ns.getScriptRam(scriptName, host));
    ns.exec(scriptName, host, threads, target, moneyThresh, securityThresh);
    return;
  }

  await ns.killall(host);
  if (ns.getServerMaxRam(host) < ns.getScriptRam(scriptName, 'home')) {
    return;
  }

  if (!ns.hasRootAccess(host)) {
    gainRootAccess(ns, host);
  }

  await ns.scp(scriptName, 'home', host);
  let threads = Math.floor(ns.getServerMaxRam(host) / ns.getScriptRam(scriptName, host));
  ns.exec(scriptName, host, threads, target, moneyThresh, securityThresh);
  ns.print('Starting hack on server: ' + host);
  ns.print('Targeting server: ' + target);
}

export async function main(ns) {
  const serverList = multiscan(ns, 'home');
  const targetDetails = findTargetServer(ns, serverList);
  let props = {
    'host': '',
    ...targetDetails,
  };
  for (let i = 0; i < serverList.length; i++) {
    props.host = serverList[i];
    console.log(props.host)
    await startHack(ns, props);
  }
}