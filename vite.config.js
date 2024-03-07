import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import vitCompression from 'vite-plugin-compression'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	return {
    base: process.env.NODE_ENV === 'production' ? './' : '/',
    root: process.cwd(),
		plugins: [
			vue(),
      // 打包项目后，打开可视工具，分析打包后文件的大小
      visualizer({
        open: true
      }),
			Components({
				resolvers: [VantResolver()]
			}),
      // 构建压缩文件
      vitCompression({
        // 记录压缩文件及其压缩率,默认为true
        verbose:true,
        // 是否禁用压缩
        disable:false,
        // 压缩后是否删除原文件
        deleteOriginFile: false,
        // 需要使用压缩前的最小文件大小
        threshold:'10240',
        // 压缩算法
        algorithm:'gzip',
        // 压缩后的文件格式
        ext:'gz'
      })
		],
		resolve: {
			alias: {
				'@': resolve(__dirname, 'src')
			},
			// 导入时想要省略的扩展名列表
			extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
		},
    build: {
      target: 'modules',
      outDir: 'dist', // 指定输出路径
      assetsDir: 'assets', // 指定生成静态文件目录
      assetsInlineLimit: '4096', // 小于此阈值的导入或引用资源将内联为 base64 编码
      chunkSizeWarningLimit: 500, // chunk 大小警告的限制
      minify: 'terser', // 混淆器，terser构建后文件体积更小
      emptyOutDir: true, //打包前先清空原有打包文件
      reportCompressedSize: false, // 禁用 gzip 压缩大小报告，可略微减少打包时间
      terserOptions: {
        // 清除console和debugger
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        output: {
          comments: true // 去掉注释内容
        }
      },
      rollupOptions: {
        output: {
          //配置这个是让不同类型文件放在不同文件夹，不会显得太乱
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]',
          manualChunks(id) {
            //静态资源分拆打包
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      }
    },
		css: {
			// 配置全局的scss文件,vite不需要安装sass-loader
			preprocessorOptions: {
				scss: {
					additionalData: `
            @import "@/assets/scss/variable.scss";
            @import "@/assets/scss/mixin.scss";
        `
				}
			}
		},
		server: {
			open: true,
      // 这样在启动项目的时候，可以通过本地ip地址访问
      host: '0.0.0.0',
      // proxy: {
      //   '/api': {
      //     target: 'https://569967a1.r3.cpolar.cn/', // 代理跳转的地址
      //     rewrite: (path) => path.replace(/^\/api/, ""),
      //     changeOrigin: true,
      //     secure: false // 接受 运行在 https 上的服务
      //   }
      // }
		}
	}
})
