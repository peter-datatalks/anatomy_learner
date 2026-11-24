"""One-off migration helper: evaluates the v0.3 prototype's <script> in macOS JavaScript
(osascript JXA) with a stub DOM and writes its data objects to build/prototype-dump.json.
Kept for the record; the JSON files in content/ are now the source of truth."""
import pathlib, subprocess, sys
root = pathlib.Path(__file__).resolve().parent.parent
html = (root / 'prototype' / 'anatomia360-v0.3.html').read_text(encoding='utf-8')
script = html[html.index('<script>') + 8: html.rindex('</script>')]
out = root / 'build' / 'prototype-dump.json'
out.parent.mkdir(exist_ok=True)
stub = r'''
var __stub = new Proxy(function(){}, {get:(t,k)=> k===Symbol.toPrimitive ? (()=>'') : (k==='length'?0:__stub), apply:()=>__stub, set:()=>true, construct:()=>__stub});
var document = {querySelector:()=>__stub, querySelectorAll:()=>[], getElementById:()=>__stub, addEventListener(){}, documentElement:__stub, body:__stub, createElement:()=>__stub};
var window = {addEventListener(){}, innerWidth:1200, scrollTo(){}};
var location = {hash:''};
var localStorage = {getItem:()=>null, setItem(){}};
function setInterval(){return 0} function clearInterval(){}
'''
dump = r'''
;(function(){
  const data = {TERMS: TERMS.map(t=>({id:t.id, hu:t[0], sv:t[1], la:t[2], cat:t[3], syn:t[4]})), SHEETS, SHEET_ORDER, CN, Q, KI, LAYERS, PX_LAYERS, PX_LESIONS, PX_ROOTS, PX_BRANCHES, SV, TOPICS, TOPICS_SV, CAT, CAT_SV, LINK_SV};
  const s = JSON.stringify(data, null, 1);
  __J.NSString.alloc.initWithUTF8String(s).writeToFileAtomicallyEncodingError(OUT, true, __J.NSUTF8StringEncoding, null);
  return 'ok ' + s.length;
})();
'''
src = 'ObjC.import("Foundation");\nvar __J=$;var OUT=' + repr(str(out)) + ';\n' + stub + '(function(){\n' + script + '\nreturn ' + dump.strip().lstrip(';') + '\n})();'
tmp = root / 'build' / '_dump.js'
tmp.write_text(src, encoding='utf-8')
r = subprocess.run(['osascript', '-l', 'JavaScript', str(tmp)], capture_output=True, text=True)
tmp.unlink()
print(r.stdout.strip(), r.stderr.strip()[:2000])
sys.exit(r.returncode)
