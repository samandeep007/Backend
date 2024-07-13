export const presets = [
    [
        '@babel/preset-env',
        {
            targets: {
                node: 'current',
            },
            modules: 'auto', // This should be 'auto' or 'commonjs' for Jest
        },
    ],
];