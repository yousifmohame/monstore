'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit, Save, X, Package, Heart, Bell, Shield, Camera, Send, MessageCircle } from 'lucide-react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';
import { useAuth } from '@/hooks/useAuth';

export default function ProfilePage() {
  const { user, profile, changeUserPassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleChangePassword() {
    setMessage(null);
    setError(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("يرجى ملء جميع الحقول");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("كلمتا المرور الجديدتان غير متطابقتين");
      return;
    }
    try {
      await changeUserPassword(currentPassword, newPassword);
      setMessage("تم تحديث كلمة المرور بنجاح");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("حدث خطأ أثناء تحديث كلمة المرور");
    }
  }

  // Mock async function to delete account
  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "هل أنت متأكد من حذف حسابك؟ سيتم فقدان جميع البيانات نهائيًا."
    );
    if (!confirmed) return;

    try {
      // TODO: Call your API or Firebase auth delete method here
      alert("تم حذف الحساب بنجاح");
    } catch {
      alert("حدث خطأ أثناء حذف الحساب");
    }
  }

  useEffect(() => {
    setFormData({
      fullName: profile?.fullName || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      city: profile?.city || '',
      postalCode: profile?.postalCode || ''
    })
  }, [profile])

  const [profileImage, setProfileImage] = useState('/placeholder.jpg');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'support', text: 'مرحباً بك في كيوتاكو! كيف يمكنني مساعدتك اليوم؟', time: '10:30' },
    { id: 2, sender: 'user', text: 'مرحباً، أريد الاستفسار عن طلبي الأخير', time: '10:32' },
    { id: 3, sender: 'support', text: 'بالتأكيد! هل يمكنك تزويدي برقم الطلب؟', time: '10:33' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const updateUser = async (user: any) => {
    await fetch("/api/auth/me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
  }

  const handleSave = () => {
    // Mock save functionality
    setIsEditing(false);
    // In a real app, you would save to the backend here
    const newData = {
      ...formData,
    }
    updateUser({ uid: user?.id, ...newData })
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setProfileImage(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: 'user',
        text: newMessage,
        time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');

      // Simulate response after 1 second
      setTimeout(() => {
        const responseMsg = {
          id: messages.length + 2,
          sender: 'support',
          text: 'شكراً لتواصلك معنا. سيقوم أحد ممثلي خدمة العملاء بالرد عليك قريباً.',
          time: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, responseMsg]);

        // Scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 1000);
    }
  };

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const tabs = [
    { id: 'profile', label: 'الملف الشخصي', icon: User },
    { id: 'orders', label: 'طلباتي', icon: Package },
    { id: 'wishlist', label: 'قائمة الأمنيات', icon: Heart },
    { id: 'messages', label: 'الرسائل', icon: MessageCircle },
    { id: 'security', label: 'الأمان', icon: Shield }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container-custom py-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">يجب تسجيل الدخول أولاً</h1>
            <p className="text-gray-600 mb-8">للوصول إلى ملفك الشخصي، يرجى تسجيل الدخول</p>
            <a href="/auth/login" className="btn-primary">
              تسجيل الدخول
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container-custom py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="anime-card p-6 mb-6">
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden">
                    <Image
                      src={profileImage}
                      alt={profile?.fullName || 'صورة المستخدم'}
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="hidden"
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-800">{profile?.fullName}</h2>
                <p className="text-gray-600">{profile?.email}</p>
                {profile?.isAdmin && (
                  <span className="inline-block bg-primary-100 text-primary-600 px-3 py-1 rounded-full text-sm font-semibold mt-2">
                    مدير
                  </span>
                )}
              </div>
            </div>

            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-colors ${activeTab === tab.id
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                  {tab.id === 'messages' && (
                    <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center mr-auto">
                      2
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="anime-card p-8"
              >
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-gray-800">الملف الشخصي</h1>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      <Edit className="h-4 w-4" />
                      تعديل
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        حفظ
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        إلغاء
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      <User className="inline h-4 w-4 ml-2" />
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input-field text-right ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      <Mail className="inline h-4 w-4 ml-2" />
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input-field text-right ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      <Phone className="inline h-4 w-4 ml-2" />
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input-field text-right ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      <MapPin className="inline h-4 w-4 ml-2" />
                      المدينة
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input-field text-right ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2">
                      <MapPin className="inline h-4 w-4 ml-2" />
                      العنوان
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input-field text-right ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      الرمز البريدي
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className={`input-field text-right ${!isEditing ? 'bg-gray-50' : ''}`}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="anime-card p-8"
              >
                <h1 className="text-3xl font-bold text-gray-800 mb-8">طلباتي</h1>
                <div className="text-center py-16">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">لا توجد طلبات</h3>
                  <p className="text-gray-600 mb-6">لم تقم بأي طلبات حتى الآن</p>
                  <a href="/products" className="btn-primary">
                    ابدأ التسوق
                  </a>
                </div>
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="anime-card p-8"
              >
                <h1 className="text-3xl font-bold text-gray-800 mb-8">قائمة الأمنيات</h1>
                <div className="text-center py-16">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">قائمة الأمنيات فارغة</h3>
                  <p className="text-gray-600 mb-6">أضف منتجات إلى قائمة أمنياتك</p>
                  <a href="/products" className="btn-primary">
                    تصفح المنتجات
                  </a>
                </div>
              </motion.div>
            )}

            {activeTab === 'messages' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="anime-card p-8"
              >
                <h1 className="text-3xl font-bold text-gray-800 mb-8">الرسائل</h1>

                <div className="bg-gray-50 rounded-xl border border-gray-200 h-[500px] flex flex-col">
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 bg-white rounded-t-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">خدمة العملاء</h3>
                        <p className="text-xs text-green-500">متصل الآن</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl p-3 ${msg.sender === 'user'
                              ? 'bg-primary-500 text-white rounded-tr-none'
                              : 'bg-gray-200 text-gray-800 rounded-tl-none'
                              }`}
                          >
                            <p>{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-gray-200 bg-white rounded-b-xl">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="اكتب رسالتك هنا..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="bg-primary-500 text-white p-2 rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="anime-card p-8"
              >
                <h1 className="text-3xl font-bold text-gray-800 mb-8">الأمان</h1>
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">تغيير كلمة المرور</h3>
                    <div className="space-y-4 max-w-md">
                      {error && <p className="text-red-600">{error}</p>}
                      {message && <p className="text-green-600">{message}</p>}
                      <input
                        type="password"
                        placeholder="كلمة المرور الحالية"
                        className="input-field text-right"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <input
                        type="password"
                        placeholder="كلمة المرور الجديدة"
                        className="input-field text-right"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <input
                        type="password"
                        placeholder="تأكيد كلمة المرور الجديدة"
                        className="input-field text-right"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <button
                        className="btn-primary"
                        onClick={handleChangePassword}
                        type="button"
                      >
                        تحديث كلمة المرور
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">حذف الحساب</h3>
                    <p className="text-gray-600 mb-4">
                      حذف الحساب سيؤدي إلى فقدان جميع البيانات والطلبات نهائياً
                    </p>
                    <button
                      className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
                      onClick={handleDeleteAccount}
                      type="button"
                    >
                      حذف الحساب
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <Cart />
    </div>
  );
}