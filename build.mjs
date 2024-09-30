import { rename, readdirSync, copyFileSync, mkdir, mkdirSync, lstatSync, cpSync } from 'fs'
import path from 'path'


cpSync("lib/src", "lib", {force: true, recursive: true})

// readdirSync("lib/src").forEach(file => {
//     if (lstatSync(path.join("lib", "src", file)).isDirectory()) {
//         mkdirSync(path.join("lib", file), {recursive: true})
//     } else {
//         copyFileSync(path.join("lib", "src", file), path.join("lib", file))
//     }
// });