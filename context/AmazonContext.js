import { createContext, useState, useEffect } from 'react'
import { useMoralis, useMoralisQuery } from 'react-moralis'

export const AmazonContext = createContext()

export const AmazonProvider = ({ children }) => {
    const [username, setUsername] = useState('')
    const [nickname, setNickname] = useState('')
    const [assets, setAssets] = useState([])

    const {
        authenticate,
        isAuthenticated,
        enableWeb3,
        Moralis,
        user,
        isWeb3Enabled
    } = useMoralis()

    const {
        data: assetsdata,
        error: assetsdataError,
        isLoading: userDataisLoading
    } = useMoralisQuery('assets')

    useEffect(() => {
        (async () => {
            if(isAuthenticated) {
                const currentUsername = user?.get('nickname')
                setUsername(currentUsername)
            }
        })()
    }, [isAuthenticated, user, username])

    useEffect(() => {
        (async () => {
            if(isWeb3Enabled) {
                await getAssets()
            }
        })()
    }, [isWeb3Enabled, assetsdata, userDataisLoading])

    const handleSetUsername = () => {
        if(user) {
            if(nickname) {
                user.set('nickname', nickname)
                user.save()
                setNickname('')
            }
        } else {
            console.log('Cant set empty nickname')
        }
    }

    const getAssets = async () => {
        try {
            await enableWeb3()
            console.log('get assets')
            setAssets(assetsdata)
        } catch(error) {
            console.log(error)
        }
    }

    return (
        <AmazonContext.Provider
            value={{
                isAuthenticated,
                nickname,
                setNickname,
                username,
                handleSetUsername,
                assets
            }}
        >
            {children}
        </AmazonContext.Provider>
    )
}