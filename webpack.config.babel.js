import path from 'path';
import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import PreloadWebpackPlugin from 'preload-webpack-plugin';
import DotenvWebpackPlugin from 'dotenv-webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ManifestPlugin from 'webpack-manifest-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const publicPath = `/`;
const chunkSuffix = 'chunk';
const entryName = 'bundle';

const copyPlugin = new CopyPlugin([
	{
		from: 'public/**/*',
		to: '.',
		flatten: true
	}
]);

const htmlWebpackPlugin = new HtmlWebpackPlugin({
	filename: 'index.html',
	template: `${__dirname}/src/index.html`,
	minify: {
		removeComments: true,
		collapseWhitespace: true
	}
});

const preloadWebpackPlugin = new PreloadWebpackPlugin({
	rel: 'preload',
	include: 'allAssets',
	fileWhitelist: [/\.js$/],
	fileBlacklist: [/polyfill-.*/],
	as(entry) {
		if (/\.(png|gif|svg)$/.test(entry)) return 'image';
		return 'script';
	}
});

const js = {
	test: /\.js[x]?$/,
	exclude: /node_modules/,
	loaders: ['babel-loader']
};

const svg = {
	test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
	use: [
		{
			loader: 'file-loader',
			options: {
				name: 'images/[name]-[hash:base64:5].[ext]'
			}
		},
		{
			loader: 'svgo-loader',
			options: {
				plugins: [
					{ removeTitle: true },
					{ convertColors: { shorthex: true } },
					{ convertPathData: true },
					{ removeUselessDefs: true },
					{ cleanupAttrs: true },
					{ removeDoctype: true },
					{ removeComments: true },
					{ removeMetadata: true },
					{ removeDesc: true },
					{ removeEmptyText: true },
					{ removeEmptyAttrs: true },
					{ removeViewBox: true },
					{ minifyStyles: true },
					{ convertTransform: true },
					{ removeUnusedNS: true }
				]
			}
		}
	]
};

const images = {
	test: /\.(woff(2)?|ttf|eot|png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
	use: {
		loader: 'file-loader',
		options: {
			name: 'images/[name]-[hash:base64:5].[ext]'
		}
	}
};

export const devPlugins = [
	new webpack.HotModuleReplacementPlugin(),
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('development')
		}
	})
];

const plugins = [
	copyPlugin,
	htmlWebpackPlugin,
	preloadWebpackPlugin,
	new webpack.HashedModuleIdsPlugin(),
	new DotenvWebpackPlugin()
];

const prdPlugins = [
	new webpack.DefinePlugin({
		'process.env': {
			NODE_ENV: JSON.stringify('production')
		}
	}),
	new ManifestPlugin({
		fileName: 'rev-manifest.json',
		publicPath,
		basePath: `/js/`,
		filter: ({ isChunk }) => !!isChunk,
		map: ({ name, ...item }) => ({
			...item,
			name: name.replace('main.js', 'bundle.js')
		})
	}),
	new BundleAnalyzerPlugin({
		analyzerMode: 'static',
		reportFilename: `${__dirname}/test-reports/bundle-analysis.html`,
		openAnalyzer: false,
		defaultSizes: 'gzip'
	})
];

const defaultConfig = {
	entry: ['@babel/polyfill', `${__dirname}/src/index.js`],
	cache: true,
	output: {
		filename: `js/${entryName}-[hash:8].js`,
		publicPath,
		path: `${__dirname}/dist`,
		chunkFilename: `js/[name]-[chunkhash:8].${chunkSuffix}.js`
	},
	resolve: {
		extensions: ['.js'],
		alias: {
			'@@': `${__dirname}/src/`
		}
	},
	module: {
		rules: [js, svg, images]
	},
	optimization: {
		splitChunks: {
			automaticNameDelimiter: '-'
		}
	},
	performance: {
		maxAssetSize: 500000
	}
};
const devConfig = {
	mode: 'development',
	...defaultConfig,
	optimization: {
		namedModules: true
	},
	output: {
		...defaultConfig.output,
		publicPath: '/'
	},
	plugins: [...devPlugins, ...plugins],
	devServer: {
		contentBase: path.join(__dirname, 'public'),
		compress: true,
		port: 8008,
		https: true,
		historyApiFallback: true,
		publicPath: '/',
		host: '0.0.0.0'
	}
};
const prdConfig = {
	...defaultConfig,
	mode: 'production',
	plugins: [...prdPlugins, ...plugins],
	optimization: { ...defaultConfig.optimization, minimize: true, minimizer: [new TerserPlugin()] }
};

export default process.env.NODE_ENV === 'production' ? prdConfig : devConfig;
