import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
	return {
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
