import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	return {
    base: process.env.NODE_ENV === 'production' ? './' : '/',
    root: process.cwd(),
		plugins: [
			vue(),
			Components({
				resolvers: [VantResolver()]
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
      // 清除console和debugger
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
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
          },
        },
      },
      target: 'modules',
      outDir: 'dist', // 指定输出路径
      assetsDir: 'assets', // 指定生成静态文件目录
      assetsInlineLimit: '4096', // 小于此阈值的导入或引用资源将内联为 base64 编码
      chunkSizeWarningLimit: 500, // chunk 大小警告的限制
      minify: 'terser', // 混淆器，terser构建后文件体积更小
      emptyOutDir: true //打包前先清空原有打包文件
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
			open: true
		}
	}
})
