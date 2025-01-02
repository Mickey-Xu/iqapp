import { Box, Button, IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { LocalizeContext } from "i18n";
import React, { useRef, useState } from 'react';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function FullScreenDialog(props) {
    const i18n = React.useContext(LocalizeContext);
    const [open, setOpen] = React.useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [photo, setPhoto] = useState(null);
    const pageHeight = document.documentElement.clientHeight;
    const [videoSize, setVideoSize] = useState({
        width: 0,
        height: 0,
        top: 0,
        bottom: 0,
    }); 


    const handleClickOpen = () => {
        setOpen(true);
        toggleCamera();
    };

    const handleClose = async () => {
        setOpen(false);
        setPhoto(null);
        const stream = videoRef.current.srcObject;
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
    };

    const toggleCamera = async () => {
        if (isCameraOn) {
            // 停止相机
            const stream = videoRef.current.srcObject;
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
            setIsCameraOn(false);
        } else {
            // 开启相机
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: { exact: 'environment' } }
                });
                // const stream = await navigator.mediaDevices.getUserMedia({
                //     video: true
                // });
                videoRef.current.srcObject = stream;
                setIsCameraOn(true);
            } catch (error) {
                console.error("Error accessing the camera:", error);
            }
        }
    };

    const takePhoto = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (video && canvas) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // 获取图像的 base64 编码
            const base64Image = canvas.toDataURL('image/png');
            setPhoto(base64Image);
            setIsCameraOn(false)
            toggleCamera()
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const element = document.getElementById('videoRef');
            const width = element.offsetWidth
            const height = element.offsetHeight;
            var rect = element.getBoundingClientRect();
            setVideoSize({
                width: width,
                height: height,
                top: rect.top + window.scrollY,
                bottom: rect.bottom + window.scrollY
            })
            // console.log(
            //     '当前视频距离顶部：', rect.top + window.scrollY +
            //     '当前视频距离部底' + rect.bottom + window.scrollY)
            // console.log(
            //     '当前视频宽度：' + width +
            //     '当前视频高度度：' + height
            // )

        }

    };

    return (
        <div>
            <Typography onClick={handleClickOpen} color="secondary" variant="body2">
                {i18n.ISNTAPP_TAKE_PICTURE}
            </Typography>
            <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
                <AppBar style={{ backgroundColor: "black" }}>
                    <Toolbar>
                        <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="body2" align='center' style={{ width: "100%" }}>
                            文字提示的对应部件 拍摄时应出现在框内
                        </Typography>
                    </Toolbar>
                </AppBar>
                    <List style={{ backgroundColor: "black", padding: 0, margin: 0 }}>
                        <video
                            onLoadedMetadata={handleLoadedMetadata}
                            id='videoRef'
                            ref={videoRef}
                            playsInline
                            autoPlay
                            style={{
                                display: isCameraOn ? 'block' : 'none', width: "100%",
                                zIndex: 1,
                                position: 'fixed',
                                marginTop: 56
                            }}
                        />
                        <img src={photo} alt="" style={{
                            maxWidth: '100%', height: 'auto', display: photo ? 'block' : 'none', position: 'absolute',
                            top: 56,
                            zIndex: 1,

                        }} />
                        <canvas ref={canvasRef} style={{ display: 'none' }} />

                        {isCameraOn && (
                            <div style={{
                                position: "absolute",
                                width: "35%",
                                height: videoSize.height / 8,
                                border: "1px dashed red",
                                top: videoSize.top + 100,
                                left: "5%",
                                borderRadius: "10%",
                                pointerEvents: 'none',
                                zIndex: 1,
                            }}>

                                <Typography variant="body2" display="block" align='center' style={{ marginTop: '-20%', color: '#e64a4a' }}>
                                    框内合同号
                                </Typography>
                            </div>
                        )}
                        {isCameraOn && (
                            <div style={{
                                position: "absolute",
                                width: "30%",
                                height: videoSize.height - 40,
                                border: "1px dashed red",
                                top: videoSize.top + 20,
                                right: "15%",
                                borderRadius: "5%",
                                pointerEvents: 'none',
                                zIndex: 1,
                            }}>
                                <Box style={{ position: 'absolute', right: '-40%', width: '100%', height: '100%' }}>
                                    <Typography variant="body2" display="block" align='right' style={{ color: '#e64a4a', position: "absolute", right: 0, top: '15%' }}>
                                        挂钩位置
                                    </Typography>
                                    <Typography variant="body2" display="block" align='right' style={{ color: '#e64a4a', position: "absolute", right: 0, top: '40%' }}>
                                        拉力计/测试片
                                    </Typography>
                                    <Typography variant="body2" display="block" align='right' style={{ color: '#e64a4a', position: "absolute", right: 0, top: '60%' }}>
                                        信息牌
                                    </Typography>
                                    <Typography variant="body2" display="block" align='right' style={{ color: '#e64a4a', position: "absolute", right: 0, top: '75%' }}>
                                        拉力计显示
                                    </Typography>
                                    <Typography variant="body2" display="block" align='right' style={{ color: '#e64a4a', position: "absolute", right: 0, top: '90%' }}>
                                        底座
                                    </Typography>
                                </Box>
                            </div>
                        )}
                        <Box style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            fontWeight: 600,
                            display: "flex",
                            justifyContent: "space-around",
                            zIndex: 1,
                        }}>
                            <Button
                                onClick={() => {
                                    toggleCamera();
                                    setIsCameraOn(true)
                                    setPhoto(null)
                                }}
                                disabled={isCameraOn}
                                style={{
                                    color: 'white',
                                }}>
                                {i18n.ISNTAPP_RESHOOT}
                            </Button>
                            <Box style={{
                                border: " 5px solid white",
                                borderRadius: "50%",
                                padding: "2px"
                            }}>
                                <Button
                                    onClick={() => takePhoto()}
                                    disabled={!isCameraOn}
                                    style={{
                                        color: 'black',
                                        width: "60px",
                                        height: "60px",
                                        backgroundColor: "white",
                                        borderRadius: " 50%",

                                    }}>
                                {i18n.ISNTAPP_TAKE_PICTURE}
                                </Button>
                            </Box>
                            <Button
                                onClick={() => {
                                    props.onChange(photo);
                                    setOpen(false);
                                    setPhoto(null);
                                }}
                                disabled={isCameraOn}
                                style={{
                                    color: 'white',
                                }}>
                                {i18n.ISNTAPP_USE_PHOTOS}
                            </Button>
                        </Box>
                        <Box style={{
                            position: "fixed",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            top: 0,
                            height: pageHeight,
                            backgroundColor: "black"
                        }}></Box>
                    </List>
            </Dialog>
        </div>
    );
}


