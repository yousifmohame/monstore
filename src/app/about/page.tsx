'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Award, Heart, Star, Zap, Globe, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Cart from '@/components/Cart';

export default function AboutPage() {
  const stats = [
    { icon: Users, label: 'عملاء سعداء', value: '10,000+' },
    { icon: Star, label: 'تقييم العملاء', value: '4.9/5' },
    { icon: Zap, label: 'منتج متاح', value: '5,000+' },
    { icon: Globe, label: 'دول نخدمها', value: '15+' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'شغف الأنمي',
      description: 'نحن فريق من محبي الأنمي الحقيقيين الذين يفهمون ما يريده المعجبون'
    },
    {
      icon: Award,
      title: 'جودة عالية',
      description: 'نختار منتجاتنا بعناية فائقة لضمان أعلى معايير الجودة'
    },
    {
      icon: Shield,
      title: 'خدمة موثوقة',
      description: 'نلتزم بتقديم خدمة عملاء ممتازة وتوصيل سريع وآمن'
    },
    {
      icon: Target,
      title: 'رؤية واضحة',
      description: 'هدفنا أن نكون الوجهة الأولى لمحبي الأنمي في العالم العربي'
    }
  ];

  const team = [
    {
      name: 'أحمد محمد',
      role: 'المؤسس والمدير التنفيذي',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'محب للأنمي منذ الطفولة، أسس المتجر لتوفير منتجات أنمي عالية الجودة'
    },
    {
      name: 'فاطمة أحمد',
      role: 'مديرة التسويق',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'خبيرة في التسويق الرقمي ومتخصصة في الوصول لمجتمع محبي الأنمي'
    },
    {
      name: 'محمد علي',
      role: 'مدير المنتجات',
      image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'يختار أفضل المنتجات من جميع أنحاء العالم لضمان رضا العملاء'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative anime-gradient text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-40 h-40 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              من نحن 🎌
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              نحن فريق شغوف بالأنمي، نسعى لتوفير أفضل منتجات الأنمي لمحبي هذا العالم الرائع في المنطقة العربية
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="text-center"
              >
                <motion.div
                  className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <stat.icon className="h-8 w-8 text-primary-600" />
                </motion.div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.value}</h3>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-6">
                قصتنا مع <span className="gradient-text">الأنمي</span>
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  بدأت رحلتنا من حب عميق للأنمي والثقافة اليابانية. كنا مجموعة من الأصدقاء الذين يشتركون في شغف واحد - عالم الأنمي الساحر بكل ما يحمله من قصص مؤثرة وشخصيات لا تُنسى.
                </p>
                <p>
                  لاحظنا أن محبي الأنمي في العالم العربي يواجهون صعوبة في العثور على منتجات أصلية وعالية الجودة. من هنا جاءت فكرة إنشاء متجر الأنمي - لنكون الجسر الذي يربط بين محبي الأنمي والمنتجات الرائعة التي يحلمون بها.
                </p>
                <p>
                  اليوم، نفخر بخدمة آلاف العملاء السعداء في جميع أنحاء المنطقة، ونستمر في توسيع مجموعتنا لتشمل أحدث وأفضل منتجات الأنمي من جميع أنحاء العالم.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="منتجات الأنمي"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <p className="text-primary-600 font-bold text-2xl">2019</p>
                <p className="text-gray-600">سنة التأسيس</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              قيمنا و<span className="gradient-text">مبادئنا</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              نؤمن بقيم أساسية توجه كل ما نقوم به في رحلتنا لخدمة مجتمع محبي الأنمي
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="anime-card p-6 text-center group"
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <value.icon className="h-8 w-8 text-primary-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              فريق <span className="gradient-text">العمل</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              تعرف على الأشخاص الرائعين الذين يعملون بجد لتحقيق رؤيتنا
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="anime-card overflow-hidden group"
                whileHover={{ y: -5 }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              مهمتنا و<span className="gradient-text">رؤيتنا</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mt-12">
              <div className="anime-card p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">مهمتنا</h3>
                <p className="text-gray-600 leading-relaxed">
                  نسعى لتوفير أفضل منتجات الأنمي عالية الجودة لمحبي الأنمي في العالم العربي، مع تقديم تجربة تسوق استثنائية وخدمة عملاء متميزة.
                </p>
              </div>
              <div className="anime-card p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">رؤيتنا</h3>
                <p className="text-gray-600 leading-relaxed">
                  أن نكون الوجهة الأولى والأكثر ثقة لمحبي الأنمي في المنطقة العربية، ونساهم في نشر ثقافة الأنمي وربط المجتمع العربي بهذا العالم الرائع.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <Cart />
    </div>
  );
}