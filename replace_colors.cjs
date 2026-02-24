const fs = require('fs');
let content = fs.readFileSync('src/App.jsx', 'utf8');

// Center logo in appHeader
content = content.replace(
    'justifyContent: "space-between", alignItems: "center", marginBottom: 4 }',
    'justifyContent: "center", alignItems: "center", marginBottom: 4, position: "relative" }'
);

// Fix saving absolute positioning
content = content.replace(
    '{saving && <span style={{ fontSize: 10, color: "#444", fontFamily: "\'Courier New\',monospace" }}>saving…</span>}',
    '{saving && <span style={{ fontSize: 10, color: "#fff", fontFamily: "\'Courier New\',monospace", position: "absolute", right: 0 }}>saving…</span>}'
);

// Replace grey text with white
const greys = ['#888', '#555', '#444', '#bbb', '#333', '#ccc', '#2a2a2a'];

greys.forEach(color => {
    content = content.split('"' + color + '"').join('"#fff"');
    content = content.split('\'' + color + '\'').join('"#fff"');
});

fs.writeFileSync('src/App.jsx', content);
console.log('Done!');
