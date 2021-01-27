import { ensureDirSync } from "https://deno.land/std@0.84.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.84.0/path/mod.ts";

export class Inspect {
    static vars(obj: { [id: string]: any }) {
        let inspectVarsPath = Deno.env.get('INSPECT_VARS');
        if (!inspectVarsPath || obj == null) {
            return;
        }

        let json = JSON.stringify(obj);
        let varsPath = inspectVarsPath.replaceAll('\\', '/');
        if (varsPath.indexOf('/') >= 0) {
            let dir = path.dirname(varsPath);
            ensureDirSync(dir);
        }
        Deno.writeTextFileSync(varsPath, json);
    }

    static dump(obj: any) {
        let to = JSON.stringify(obj, null, 4);
        return to.replace(/"/g, '');
    }

    static printDump(obj: any) {
        console.log(Inspect.dump(obj));
    }

    static dumpTable(rows: any[]): String {
        let mapRows = rows;
        let keys = Inspect.allKeys(mapRows);
        let colSizes: { [id: string]: number } = {};

        keys.forEach(k => {
            let max = k.length;
            mapRows.forEach(row => {
                let col = row[k];
                if (col != null) {
                    let valSize = `${col}`.length;
                    if (valSize > max) {
                        max = valSize;
                    }
                }
            });
            colSizes[k] = max;
        });

        let colSizesLength = Object.keys(colSizes).length;
        // sum + ' padding ' + |
        let rowWidth = Object.values(colSizes).reduce((p: number, c: number) => p + c, 0) +
            (colSizesLength * 2) +
            (colSizesLength + 1);
        let dashes = '-'.repeat(rowWidth - 2);
        let sb: string[] = [];
        sb.push(`+${dashes}+`);
        let head = '|';
        keys.forEach((k) => {
            head += Inspect.alignCenter(k, colSizes[k]) + '|';
        });
        sb.push(head);
        sb.push(`|${dashes}|`);

        mapRows.forEach(row => {
            let to = '|';
            keys.forEach(k => {
                to += '' + Inspect.alignAuto(row[k], colSizes[k]) + '|';
            });
            sb.push(to);
        });

        sb.push(`+${dashes}+`);

        return sb.join('\n');
    }

    static printDumpTable(rows: any[]) {
        console.log(Inspect.dumpTable(rows));
    }

    static allKeys(rows: any[]): string[] {
        let to: string[] = [];
        rows.forEach(o => Object.keys(o).forEach((key: any) => {
            let k = `${key}`;
            if (to.indexOf(k) === -1) {
                to.push(k);
            }
        }));
        return to;
    }

    static alignLeft(str: string, len: number, pad: string = ' '): string {
        if (len < 0) return '';
        let aLen = len + 1 - str.length;
        if (aLen <= 0) return str;
        return pad + str + pad.repeat(aLen);
    }

    static alignCenter(str: string, len: number, pad: string = ' '): string {
        if (len < 0) return '';
        str ??= '';
        let nLen = str.length;
        let half = Math.floor(len / 2 - nLen / 2);
        let odds = Math.abs((nLen % 2) - (len % 2));
        return pad.repeat(half + 1) + str + pad.repeat(half + 1 + odds);
    }

    static alignRight(str: string, len: number, pad: string = ' '): string {
        if (len < 0) return '';
        let aLen = len + 1 - str.length;
        if (aLen <= 0) return str;
        return pad.repeat(aLen) + str + pad;
    }

    static alignAuto(obj: any, len: number, pad: string = ' '): string {
        let str = `${obj}`;
        if (str.length <= len) {
            if (typeof obj == 'number') {
                return Inspect.alignRight(str, len, pad);
            }
            return Inspect.alignLeft(str, len, pad);
        }
        return str;
    }
}
