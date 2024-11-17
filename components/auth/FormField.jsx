import { View, Text, TextInput, TouchableOpacity,Image} from 'react-native'
import React,{useState} from 'react'
import { Clock, Eye } from 'lucide-react-native';
const eye=require('../../assets/eye.png')
const closeEye=require('../../assets/eye-hide.png');

//todos: to add isSubmittin useState to wait 
const FormField = ({title,value,placeholder,handleChangeText,...props}) => {

    const [showPassword, setShowPassword] = useState(false); 
    const [showConfirmPassword, setConfirmPassword]=useState(false);
  return (
    <View className="w-full mt-2">
    <Text className="text-white text-sm mb-1 flex self-start font-semibold">{title}</Text>
    <View  style={{ backgroundColor: 'rgba(0, 151, 160, 0.1)' }} className="w-full h-12 rounded-lg px-3 text-white flex-row items-center justify-between">
    <TextInput
        className="text-white"
        placeholderTextColor="#A0A0A0"
        value={value}
        placeholder={placeholder}
        onChangeText={handleChangeText}
        secureTextEntry={title==='Password' && !showPassword}
      />
      {title==='Password' && (
        <TouchableOpacity
         onPress={()=>setShowPassword(!showPassword)}
        >
        <Image source={!showPassword ? closeEye :eye}
        className="w-6 h-6"/>
        </TouchableOpacity>
      )}
      {title==='Confirm-password' && (
        <TouchableOpacity
         onPress={()=>setConfirmPassword(!showConfirmPassword)}
        >
        <Image source={!showConfirmPassword ? closeEye :eye}
        className="w-6 h-6"/>
        </TouchableOpacity>
      )}
      </View>
    </View>
    
  )
}

export default FormField