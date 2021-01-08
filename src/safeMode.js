export default async () => {
  const result = await new Promise((res) => 
    goosemod.webpackModules.findByPropsAll('show')[0].show({
      title: 'GooseMod Safe Mode Confirmation',
      
      body: 'Are you sure you want to enter Safe Mode? (Pressing H on startup results in this message)',
      confirmText: 'Enter Safe Mode',
      cancelText: 'Continue Normally',

      onCancel: () => res('cancel'),
      onConfirm: () => res('confirm')
    })
  );

  if (result === 'cancel') return true;
};