import { App, Modal, Plugin, WorkspaceLeaf } from 'obsidian';
import { DEFAULT_SETTINGS, MyPluginSettings } from './setting';
import { direction } from 'direction'


export default class MyPlugin extends Plugin {
    settings: MyPluginSettings;
    lastActiveLeaf: WorkspaceLeaf

    async onload() {
        console.log('loading plugin');
        await this.loadSettings();
        this.registerMarkdownPostProcessor((el, ctx) => {
            const changeLineDirection = (element: HTMLElement, dir: 'rtl' | 'ltr' | 'neutral') => {
                const ltr = 'leftToRight'
                const rlt = 'rightToLeft'

                const classToAdd = dir === 'rtl' ? rlt : ltr
                const classToRemove = dir === 'rtl' ? ltr : rlt

                element.classList.remove(classToRemove)

                element.classList.add(classToAdd)

            }

            changeLineDirection(el, direction(el.textContent.split(/\s/)[0]))
        })



        this.registerCodeMirror((cm) => {
            // const listeners = new Map<number, string>()

            // const rtlMovment = (lineNumber: number) => {
            //     let lastChar = '';

            //     return (event: KeyboardEvent) => {

            //         if (cm.getCursor().line === lineNumber) {
            //             const line = cm.getLine(lineNumber)
            //             console.log(lineNumber)
            //             if (event.ctrlKey) {
            //                 switch (event.key) {
            //                     case 'ArrowRight': {
            //                         const handleArrowRight = () => {
            //                             const untilCursor = line.slice(0, cm.getCursor().ch)
            //                             cm.setCursor(lineNumber, untilCursor.trimEnd().lastIndexOf(' ') + 1)
            //                             console.log('untilCursor:' + untilCursor)
            //                         }

            //                         handleArrowRight()
            //                         console.log('lastPos: ' + line[lastCursorPos.ch - 1])
            //                         console.log(line[cm.getCursor().ch - 1])
            //                         console.log('lastchar: ' + lastChar)
            //                         if (/\s/.test(lastChar)) {
            //                             handleArrowRight()
            //                         }
            //                         break;
            //                     }
            //                     case 'ArrowLeft': {
            //                         const handleArrowLeft = () => {
            //                             const afterCursor = line.slice(cm.getCursor().ch)
            //                             cm.setCursor(lineNumber, afterCursor.trimStart().indexOf(' ') - 1)
            //                             console.log('afterCursor index:' + afterCursor.trim().indexOf(' ') + 1)
            //                             console.log('afterCursor:' + afterCursor)
            //                         }
            //                         handleArrowLeft()
            //                         console.log('lastPos: ' + line[lastCursorPos.ch - 1])
            //                         console.log(line[cm.getCursor().ch - 1])
            //                         console.log('lastchar: ' + lastChar)
            //                         if (/\s/.test(lastChar)) {
            //                             handleArrowLeft()
            //                         }
            //                         break
            //                     }
            //                 }
            //             } else {
            //                 switch (event.key) {
            //                     case 'ArrowRight': {
            //                         cm.setCursor(lineNumber, cm.getCursor().ch - 2)
            //                         break;
            //                     }
            //                     case 'ArrowLeft': {
            //                         cm.setCursor(lineNumber, cm.getCursor().ch + 2)
            //                         break;
            //                     }

            //                 }
            //             }
            //             lastChar = line[cm.getCursor().ch]
            //         }
            //     }
            // }
            const changeLineDirection = (lineNumber: number, dir: 'rtl' | 'ltr' | 'neutral') => {
                const ltr = 'leftToRight'
                const rlt = 'rightToLeft'

                const classToAdd = dir === 'rtl' ? rlt : ltr
                const classToRemove = dir === 'rtl' ? ltr : rlt
                const inputField = cm.getInputField()

                cm.removeLineClass(lineNumber, 'text', classToRemove)
                inputField.classList.remove(classToRemove)

                cm.addLineClass(lineNumber, 'text', classToAdd)
                inputField.classList.add(classToAdd)

                // if (dir === 'rtl') {
                //     if (!listeners.has(lineNumber)) {
                //         listeners.set(lineNumber, '')
                //         console.log('here')
                //         inputField.addEventListener('keydown', rtlMovment(lineNumber))
                //     }
                // } else {
                //     listeners.delete(lineNumber)
                //     inputField.removeEventListener('keydown', rtlMovment(lineNumber))
                // }
            }

            const changeToMatchingDirection = (lineContent: string, lineNumber: number) => {
                changeLineDirection(lineNumber, direction(lineContent.split(/\s/)[0]))
            }

            cm.on('change', (instance, change) => {
                change.text.forEach((line, index) => {
                    const lineNumber = change.from.line + index
                    const lineContent = instance.getLine(lineNumber)
                    changeToMatchingDirection(lineContent ?? line, lineNumber)
                })
            })


        })

    }

    onunload() {
        console.log('unloading plugin');
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }
    async saveSettings() {
        await this.saveData(this.settings);
    }

}
