/// <reference path="lib.d.ts" />

function launchFileChooser() {
    const uploader = document.querySelector('.hidden-uploader') as HTMLInputElement;
    if (uploader) {
        uploader.click();
    }
}

Polymer({
    is: 'paw-filechooser',

    properties: {
        onFileChosen: Object,
    },

    ready: function() {
        const uploader = document.querySelector('.hidden-uploader') as HTMLInputElement;
        uploader.addEventListener('change', (event: Event) => {
            const file: any = (event.target as HTMLInputElement).files[0];
            if (file !== undefined && file.path !== undefined) {
                this.onFileChosen(file.path);
            }
        });
    },
});
