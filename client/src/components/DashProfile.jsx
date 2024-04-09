import React, { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux';
import {TextInput, Button, Alert, Modal} from 'flowbite-react';
import { useRef } from 'react';
import {getDownloadURL, getStorage, uploadBytesResumable, ref} from 'firebase/storage';
import { app } from '../firebase.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {HiOutlineExclamationCircle} from 'react-icons/hi'

import { updateStart,updateSuccess,updateFailure,deleteUserStart,deleteUserSuccess,deleteUserFailure,signOutSuccess } from '../redux/user/userSlice.js';

export default function DashProfile() {
    const {currentUser, error}=useSelector(state=>state.user);
    const [imageFile,setImageFile]=useState(null);
    const [imageFileUrl,setImageFileUrl]=useState(null);
    const [imageFileUploadProgress,setImageFileUploadProgress]=useState(0);
    const [imageFileUploadError,setImageFileUploadError]=useState(null);
    const [formData,setFormData]=useState({});
    const [imageUploading,setImageUploading]=useState(null);
    const [updateUserSuccess,setUpdateUserSuccess]=useState(null);
    const [updateUserError,setUpdateUserError]=useState(null);
    const [showModal,setShowModal]=useState(false);
    const filePickerRef=useRef();
    const dispatch=useDispatch();

    //console.log(imageFileUploadProgress,imageFileUploadError);

    const handleImageChange=(e)=>{
        const file=e.target.files[0];
        if(file)
        {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    }
    //console.log(imageFile,imageFileUrl);

    useEffect(()=>{
        if(imageFile)
        {
            uploadImage();
        }
    },[imageFile]);

    const uploadImage=async()=>{
        setImageUploading(true);
        setImageFileUploadError(null);
        //added rules in firebase storage
        const storage=getStorage(app);
        const fileName=new Date().getTime()+imageFile.name;
        const storageRef=ref(storage,fileName);
        const uploadTask=uploadBytesResumable(storageRef,imageFile);
        uploadTask.on(
            'state_changed',
            (snapshot)=>{
                const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
                setImageFileUploadProgress(progress.toFixed(0));
            },
            (error)=>{
                setImageFileUploadError('File must be less than 2mb.');
                setImageFileUploadProgress(0);
                setImageFile(null);
                setImageFileUrl(null);
                setImageUploading(false);
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    setImageFileUrl(downloadURL);
                    setFormData({...formData,profilePicture: downloadURL});
                    setImageUploading(false);
                });
            }
        );
    }

    const handleChange=(e)=>{
        setFormData({...formData, [e.target.id]: e.target.value})
    };
    //console.log(formData);

    const handleSubmit=async(e)=>{
        e.preventDefault();
        setUpdateUserError(null);
        setUpdateUserSuccess(null);
        if(Object.keys(formData).length===0)
        {
            setUpdateUserError('No changes made!');
            return;
        }
        if(imageUploading)
        {
            setUpdateUserError('Please wait for image to upload!');
            return;
        }
        try{
            dispatch(updateStart());
            const res=await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data=await res.json();
            if(!res.ok)
            {
                dispatch(updateFailure(data.message));
                setUpdateUserError(data.message);
            }
            else
            {
                dispatch(updateSuccess(data));
                setUpdateUserSuccess("User's profile is updated successfully!");
            }
        }
        catch(err){
            dispatch(updateFailure(err.message));
            setUpdateUserError(err.message);
        }
    };

    const handleDeleteUser=async()=>{
        setShowModal(false);
        try{
            dispatch(deleteUserStart());
            const res=await fetch(`/api/user/delete/${currentUser._id}`,
                                                     {method: 'DELETE',});
            const data=await res.json();
            if(!res.ok)
            {
                dispatch(deleteUserFailure(data.message));
            }
            else
            {
                dispatch(deleteUserSuccess(data));
            }
        }
        catch(err){
            dispatch(deleteUserFailure(err.message));
        }
    }

    const handleSignOut=async()=>{
        try{
            const res=await fetch(`/api/user/signout`, {
                method: 'POST',
            });
            const data=await res.json();
            if(!res.ok)
            {
                console.log(data.message);
            }
            else
            {
                dispatch(signOutSuccess());
            }
        }
        catch(err){
            console.log(err.message);
        }
    }

  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <input hidden type="file" accept='image/*' onChange={handleImageChange} ref={filePickerRef} />
            <div className='relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full' onClick={()=>filePickerRef.current.click()}>
                {imageFileUploadProgress && (
                    <CircularProgressbar value={imageFileUploadProgress || 0} text={`${imageFileUploadProgress}%`}
                    strokeWidth={5}
                    styles={{
                        root:{
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                        },
                        path:{
                            stroke: `rgba(62,152,199, ${
                                imageFileUploadProgress/100
                            })`,
                        }
                    }} />
                )}
                <img src={imageFileUrl || currentUser.profilePicture} alt="user" className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress<100 && 'opacity-60'}`} />
            </div>
            {imageFileUploadError && <Alert color='failure'>{imageFileUploadError}</Alert>}
            <TextInput type='text' id='username' placeholder='Username' defaultValue={currentUser.username} onChange={handleChange} />
            <TextInput type='email' id='email' placeholder='Email' defaultValue={currentUser.email} onChange={handleChange} />
            <TextInput type='password' id='password' placeholder='Password' defaultValue='**********' onChange={handleChange} />
            <Button type='submit' gradientDuoTone='purpleToBlue' outline>Update</Button>
        </form>
        <div className="text-red-500 flex justify-between mt-5">
            <span className='cursor-pointer' onClick={()=>setShowModal(true)}>Delete Account</span>
            <span className='cursor-pointer' onClick={handleSignOut}>Sign Out</span>
        </div>
        {updateUserSuccess && (
            <Alert color='success' className='mt-5'>
                {updateUserSuccess}
            </Alert>
        )}
        {updateUserError && (
            <Alert color='failure' className='mt-5'>
                {updateUserError}
            </Alert>
        )}
        {error && (
            <Alert color='failure' className='mt-5'>
                {error}
            </Alert>
        )}
        <Modal show={showModal} onClose={()=>setShowModal(false)} popup size='md'>
            <Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
                    </div>
                    <div className='flex justify-center gap-4'>
                        <Button color='failure' onClick={handleDeleteUser}>Yes, I am sure</Button>
                        <Button color='gray' onClick={()=>setShowModal(false)}>No, cancel</Button>
                    </div>
                </Modal.Body>
            </Modal.Header>
        </Modal>
    </div>
  );
}
