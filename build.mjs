import * as esbuild from 'esbuild'

switch (process.argv[2]) {
    case "build":
        await esbuild.build({
            entryPoints: ["src/index.ts"],
            target: "es2020",
            bundle: true,
            sourcemap: true,
            minify: true,
            color: true,
            outdir: "public",
            loader: {
                ".png": "file"
            }
        })
        break
    case "serve":
        let ctx = await esbuild.context({
            entryPoints: ['src/index.ts'],
            bundle: true,
            target: "es2020",
            outdir: 'public',
            sourcemap: true,
            loader: {
                ".png": "file"
            }
            // minify:true
        })
        await ctx.serve({
            port: 1234,
            servedir: "public"
        },).catch(() => process.exit(1))
        break
    default:
        console.log(process.argv)
}


