import { defineConfig } from 'wxt';

export default defineConfig({
  srcDir: '.',
  outDir: '.output',
  manifest: {
    name: 'Reading Margin Recall',
    description: 'Turn selected passages into private, source-linked review notes.',
    version: '1.0.0',
    permissions: ['storage', 'activeTab', 'downloads'],
    action: { default_title: 'Reading Margin Recall' },
    icons: {
      16: 'icons/16.png',
      32: 'icons/32.png',
      48: 'icons/48.png',
      128: 'icons/128.png'
    }
  }
});
